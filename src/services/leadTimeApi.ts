import { useApiAuthStore } from '@/store/useAuthStore';

const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:3001';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useApiAuthStore.getState().token;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401 || res.status === 403) {
    useApiAuthStore.getState().clearAuth();
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json();
}

export async function apiLogin(username: string, password: string) {
  return apiFetch<{ token: string; username: string; role: string }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function verifyToken() {
  return apiFetch<{ valid: boolean; username: string; role: string }>('/api/auth/verify', {
    method: 'POST',
  });
}

export interface LeadTimeEntry {
  id: string;
  model: string;
  deploymentType: string;
  region: string;
  estimatedLeadTime: string;
  leadTimeDays: number;
  status: 'available' | 'limited' | 'constrained';
  notes: string;
  lastUpdated: string;
}

export async function fetchLeadTimes(filters?: { model?: string; region?: string; type?: string }) {
  const params = new URLSearchParams();
  if (filters?.model) params.set('model', filters.model);
  if (filters?.region) params.set('region', filters.region);
  if (filters?.type) params.set('type', filters.type);
  const qs = params.toString();
  return apiFetch<{ data: LeadTimeEntry[]; total: number; filtered: number }>(`/api/lead-times${qs ? `?${qs}` : ''}`);
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  username: string;
  ip: string;
  userAgent: string;
  details: Record<string, unknown>;
}

export async function fetchAuditLog(filters?: { user?: string; action?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (filters?.user) params.set('user', filters.user);
  if (filters?.action) params.set('action', filters.action);
  if (filters?.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return apiFetch<{ data: AuditEntry[]; total: number }>(`/api/audit${qs ? `?${qs}` : ''}`);
}
