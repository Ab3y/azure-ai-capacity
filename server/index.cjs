const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'azure-ai-capacity-jwt-secret-2026';
const JWT_EXPIRY = '24h';

app.use(cors());
app.use(express.json());

// --- Data Paths ---
const DATA_DIR = path.join(__dirname, 'data');
const LEAD_TIMES_FILE = path.join(DATA_DIR, 'leadTimes.json');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data dir exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// --- Helper: Read/Write JSON ---
function readJSON(filePath, fallback = []) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (e) { console.error(`Error reading ${filePath}:`, e.message); }
  return fallback;
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Initialize Users ---
function initUsers() {
  const users = readJSON(USERS_FILE, null);
  if (!users) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('capacity2026', salt);
    writeJSON(USERS_FILE, [
      { username: 'admin', passwordHash: hash, role: 'admin' }
    ]);
    console.log('Default admin user created');
  }
}
initUsers();

// --- Audit Logger ---
function logAudit(action, username, details = {}) {
  const audit = readJSON(AUDIT_FILE, []);
  audit.push({
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    timestamp: new Date().toISOString(),
    action,
    username: username || 'anonymous',
    ip: details.ip || 'unknown',
    userAgent: details.userAgent || 'unknown',
    details: details.extra || {},
  });
  // Keep last 10000 entries
  if (audit.length > 10000) audit.splice(0, audit.length - 10000);
  writeJSON(AUDIT_FILE, audit);
}

// --- JWT Auth Middleware ---
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    logAudit('AUTH_FAILED', null, { ip: req.ip, userAgent: req.get('User-Agent'), extra: { reason: 'No token' } });
    return res.status(401).json({ error: 'Authentication required' });
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      logAudit('AUTH_FAILED', null, { ip: req.ip, userAgent: req.get('User-Agent'), extra: { reason: 'Invalid token' } });
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// --- Routes: Auth ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readJSON(USERS_FILE, []);
  const user = users.find(u => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    logAudit('LOGIN_FAILED', username, { ip: req.ip, userAgent: req.get('User-Agent') });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  logAudit('LOGIN_SUCCESS', username, { ip: req.ip, userAgent: req.get('User-Agent') });
  res.json({ token, username: user.username, role: user.role, expiresIn: JWT_EXPIRY });
});

app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, username: req.user.username, role: req.user.role });
});

// --- Routes: Lead Times ---
app.get('/api/lead-times', authenticateToken, (req, res) => {
  const leadTimes = readJSON(LEAD_TIMES_FILE, []);
  const { model, region, type } = req.query;

  let filtered = leadTimes;
  if (model) filtered = filtered.filter(lt => lt.model.toLowerCase().includes(model.toLowerCase()));
  if (region) filtered = filtered.filter(lt => lt.region.toLowerCase().includes(region.toLowerCase()));
  if (type) filtered = filtered.filter(lt => lt.deploymentType.toLowerCase().includes(type.toLowerCase()));

  logAudit('VIEW_LEAD_TIMES', req.user.username, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    extra: { filters: { model, region, type }, resultCount: filtered.length },
  });

  res.json({ data: filtered, total: leadTimes.length, filtered: filtered.length });
});

// --- Routes: Audit Log (Admin Only) ---
app.get('/api/audit', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const audit = readJSON(AUDIT_FILE, []);
  const { user: filterUser, action, from, to, limit } = req.query;

  let filtered = [...audit].reverse(); // newest first
  if (filterUser) filtered = filtered.filter(a => a.username.toLowerCase().includes(filterUser.toLowerCase()));
  if (action) filtered = filtered.filter(a => a.action.toLowerCase().includes(action.toLowerCase()));
  if (from) filtered = filtered.filter(a => new Date(a.timestamp) >= new Date(from));
  if (to) filtered = filtered.filter(a => new Date(a.timestamp) <= new Date(to));

  const maxEntries = Math.min(parseInt(limit) || 200, 1000);
  filtered = filtered.slice(0, maxEntries);

  logAudit('VIEW_AUDIT_LOG', req.user.username, { ip: req.ip, userAgent: req.get('User-Agent') });

  res.json({ data: filtered, total: audit.length });
});

// --- Serve Static SPA ---
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Azure AI Capacity server running on port ${PORT}`);
  console.log(`API: http://localhost:${PORT}/api`);
  console.log(`Dashboard: http://localhost:${PORT}`);
});
