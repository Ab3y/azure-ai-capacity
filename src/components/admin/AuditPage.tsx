import { Shield, Search, RefreshCw, User, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApiLoginGate } from '@/components/shared/ApiLoginGate';
import { fetchAuditLog } from '@/services/leadTimeApi';
import type { AuditEntry } from '@/services/leadTimeApi';
import { useApiAuthStore } from '@/store/useAuthStore';
import { cn } from '@/lib/utils';

function getActionStyle(action: string) {
  if (action.includes('LOGIN_SUCCESS')) return 'text-green-600 dark:text-green-400 bg-green-500/10';
  if (action.includes('FAILED')) return 'text-red-600 dark:text-red-400 bg-red-500/10';
  if (action.includes('VIEW_LEAD')) return 'text-blue-600 dark:text-blue-400 bg-blue-500/10';
  if (action.includes('VIEW_AUDIT')) return 'text-purple-600 dark:text-purple-400 bg-purple-500/10';
  return 'text-gray-600 dark:text-gray-400 bg-gray-500/10';
}

function AuditContent() {
  const [data, setData] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchUser, setSearchUser] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const role = useApiAuthStore(s => s.role);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchAuditLog({
        user: searchUser || undefined,
        action: actionFilter || undefined,
        limit: 200,
      });
      setData(result.data);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <Shield className="w-12 h-12 text-[hsl(var(--muted-foreground))] mx-auto mb-3" />
          <h3 className="font-semibold text-[hsl(var(--foreground))]">Admin Access Required</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">You need admin privileges to view the audit log.</p>
        </div>
      </div>
    );
  }

  const uniqueActions = [...new Set(data.map(a => a.action))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Shield className="w-6 h-6 text-[hsl(var(--primary))]" />
            Audit Log
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Track who accessed the API and what they were looking for
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-1 rounded-lg">
            {total} total entries
          </span>
          <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--foreground))] disabled:opacity-50">
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Filter by username..." value={searchUser} onChange={e => setSearchUser(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]">
          <option value="">All Actions</option>
          {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <button onClick={load} className="px-3 py-2 text-sm bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}

      {/* Audit Table */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Timestamp</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Action</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">User</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">IP</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--border))]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[hsl(var(--muted))] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[hsl(var(--muted-foreground))]">No audit entries found</td></tr>
              ) : (
                data.map(entry => (
                  <tr key={entry.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("px-2 py-0.5 rounded text-xs font-mono font-medium", getActionStyle(entry.action))}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />
                        <span className="text-[hsl(var(--foreground))] font-medium">{entry.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] font-mono">{entry.ip}</td>
                    <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] max-w-[250px] truncate">
                      {Object.keys(entry.details).length > 0 ? JSON.stringify(entry.details) : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
          Showing {data.length} of {total} entries
        </div>
      </div>
    </div>
  );
}

export function AuditPage() {
  return (
    <ApiLoginGate title="Admin Audit Log">
      <AuditContent />
    </ApiLoginGate>
  );
}
