import { Clock, Search, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ApiLoginGate } from '@/components/shared/ApiLoginGate';
import { fetchLeadTimes } from '@/services/leadTimeApi';
import type { LeadTimeEntry } from '@/services/leadTimeApi';
import { cn } from '@/lib/utils';

function getStatusStyle(status: string) {
  switch (status) {
    case 'available': return { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' };
    case 'limited': return { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' };
    case 'constrained': return { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' };
    default: return { bg: 'bg-gray-500/10', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500' };
  }
}

function getLeadTimeColor(days: number) {
  if (days === 0) return 'text-green-600 dark:text-green-400';
  if (days <= 2) return 'text-blue-600 dark:text-blue-400';
  if (days <= 5) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

function LeadTimesContent() {
  const [data, setData] = useState<LeadTimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchLeadTimes();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = data.filter(lt => {
    if (search && !lt.model.toLowerCase().includes(search.toLowerCase()) &&
        !lt.region.toLowerCase().includes(search.toLowerCase()) &&
        !lt.deploymentType.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'all' && lt.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Clock className="w-6 h-6 text-[hsl(var(--primary))]" />
            Capacity Lead Times
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Estimated time to fulfill Azure AI capacity requests by model and deployment type
          </p>
        </div>
        <button onClick={load} disabled={loading} className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--foreground))] disabled:opacity-50">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input type="text" placeholder="Search models, regions, types..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]">
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="limited">Limited</option>
          <option value="constrained">Constrained</option>
        </select>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
        <span className="font-medium">Lead Time:</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Instant</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> 1-2 days</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 3-5 days</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> 5+ days</span>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">{error}</div>}

      {/* Table */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Model</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Deployment Type</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Region</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Lead Time</th>
                <th className="text-center px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Notes</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[hsl(var(--border))]">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-[hsl(var(--muted))] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-[hsl(var(--muted-foreground))]">No results found</td></tr>
              ) : (
                filtered.map(lt => {
                  const statusStyle = getStatusStyle(lt.status);
                  return (
                    <tr key={lt.id} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                      <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{lt.model}</td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{lt.deploymentType}</td>
                      <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{lt.region}</td>
                      <td className={cn("px-4 py-3 font-semibold", getLeadTimeColor(lt.leadTimeDays))}>{lt.estimatedLeadTime}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium capitalize", statusStyle.bg, statusStyle.text)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
                          {lt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))] max-w-[300px]">{lt.notes}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
          Showing {filtered.length} of {data.length} entries · Last updated: {data[0]?.lastUpdated ? new Date(data[0].lastUpdated).toLocaleDateString() : 'N/A'}
        </div>
      </div>
    </div>
  );
}

export function LeadTimesPage() {
  return (
    <ApiLoginGate title="Capacity Lead Times">
      <LeadTimesContent />
    </ApiLoginGate>
  );
}
