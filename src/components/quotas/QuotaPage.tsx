import { Table2, Search, Download, ExternalLink, Info } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ProgressBar } from '@/components/shared/ProgressBar';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { getUtilizationStatus } from '@/utils/formatters';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { TOOLTIPS } from '@/data/tooltipContent';

const DEMO_QUOTAS = [
  { model: 'gpt-4o', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 240000, used: 180000, unit: 'TPM' },
  { model: 'gpt-4o', family: 'GPT-4o', type: 'Global Standard', region: 'Global', limit: 600000, used: 150000, unit: 'TPM' },
  { model: 'gpt-4o-mini', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 300000, used: 95000, unit: 'TPM' },
  { model: 'gpt-4.1', family: 'GPT-4.1', type: 'Standard', region: 'Sweden Central', limit: 80000, used: 45000, unit: 'TPM' },
  { model: 'gpt-4.1-mini', family: 'GPT-4.1', type: 'Global Standard', region: 'Global', limit: 500000, used: 200000, unit: 'TPM' },
  { model: 'o3', family: 'o-series', type: 'Standard', region: 'East US 2', limit: 30000, used: 28000, unit: 'TPM' },
  { model: 'o4-mini', family: 'o-series', type: 'DataZone Standard', region: 'US DataZone', limit: 100000, used: 35000, unit: 'TPM' },
  { model: 'gpt-4-turbo', family: 'GPT-4', type: 'Standard', region: 'UK South', limit: 80000, used: 12000, unit: 'TPM' },
  { model: 'text-embedding-3-large', family: 'Embeddings', type: 'Standard', region: 'West US', limit: 1000000, used: 500000, unit: 'TPM' },
  { model: 'text-embedding-3-small', family: 'Embeddings', type: 'Global Standard', region: 'Global', limit: 2000000, used: 400000, unit: 'TPM' },
  { model: 'dall-e-3', family: 'DALL-E', type: 'Standard', region: 'East US', limit: 30, used: 8, unit: 'RPM' },
  { model: 'whisper', family: 'Whisper', type: 'Standard', region: 'North Central US', limit: 3, used: 1, unit: 'RPM' },
  { model: 'claude-4-sonnet', family: 'Anthropic Claude', type: 'Serverless', region: 'East US', limit: 100000, used: 60000, unit: 'TPM' },
  { model: 'llama-4-scout', family: 'Meta Llama', type: 'Serverless', region: 'West US 3', limit: 50000, used: 15000, unit: 'TPM' },
  { model: 'mistral-large', family: 'Mistral', type: 'Serverless', region: 'France Central', limit: 80000, used: 20000, unit: 'TPM' },
];

type SortField = 'model' | 'type' | 'region' | 'usage';
type SortDir = 'asc' | 'desc';

export function QuotaPage() {
  const [search, setSearch] = useState('');
  const [familyFilter, setFamilyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('usage');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const families = ['all', ...new Set(DEMO_QUOTAS.map(q => q.family))];
  const types = ['all', ...new Set(DEMO_QUOTAS.map(q => q.type))];

  const filtered = useMemo(() => {
    return DEMO_QUOTAS
      .filter(q => {
        if (search && !q.model.toLowerCase().includes(search.toLowerCase()) && !q.region.toLowerCase().includes(search.toLowerCase())) return false;
        if (familyFilter !== 'all' && q.family !== familyFilter) return false;
        if (typeFilter !== 'all' && q.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => {
        const dir = sortDir === 'asc' ? 1 : -1;
        switch (sortField) {
          case 'model': return a.model.localeCompare(b.model) * dir;
          case 'type': return a.type.localeCompare(b.type) * dir;
          case 'region': return a.region.localeCompare(b.region) * dir;
          case 'usage': return ((a.used / a.limit) - (b.used / b.limit)) * dir;
          default: return 0;
        }
      });
  }, [search, familyFilter, typeFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const handleExport = () => {
    const csv = [
      'Model,Family,Type,Region,Limit,Used,Usage%,Unit',
      ...filtered.map(q => `${q.model},${q.family},${q.type},${q.region},${q.limit},${q.used},${Math.round((q.used/q.limit)*100)}%,${q.unit}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'azure-ai-quotas.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Table2 className="w-6 h-6 text-[hsl(var(--primary))]" />
            Quota Details
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Detailed view of all Azure AI quota limits and usage
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--muted))] transition-colors text-[hsl(var(--foreground))]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <a
            href="https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[hsl(var(--primary))] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="w-4 h-4" /> Request Increase
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--muted-foreground))]" />
          <input
            type="text"
            placeholder="Search models or regions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
          />
        </div>
        <select
          value={familyFilter}
          onChange={e => setFamilyFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          {families.map(f => (
            <option key={f} value={f}>{f === 'all' ? 'All Families' : f}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
        >
          {types.map(t => (
            <option key={t} value={t}>{t === 'all' ? 'All Types' : t}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('model')}>
                  Model {sortField === 'model' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('type')}>
                  <span className="flex items-center gap-1">
                    Type {sortField === 'type' && (sortDir === 'asc' ? '↑' : '↓')}
                    <InfoTooltip data={TOOLTIPS.standard}>
                      <Info className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    </InfoTooltip>
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('region')}>
                  Region {sortField === 'region' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">
                  <span className="flex items-center gap-1">
                    Usage
                    <InfoTooltip data={TOOLTIPS.utilization}>
                      <Info className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                    </InfoTooltip>
                  </span>
                </th>
                <th className="text-center px-4 py-3 font-medium text-[hsl(var(--muted-foreground))] cursor-pointer hover:text-[hsl(var(--foreground))]" onClick={() => handleSort('usage')}>
                  % {sortField === 'usage' && (sortDir === 'asc' ? '↑' : '↓')}
                </th>
                <th className="text-center px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => {
                const percent = Math.round((q.used / q.limit) * 100);
                const status = getUtilizationStatus(percent);
                return (
                  <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-[hsl(var(--foreground))]">{q.model}</span>
                      <span className="block text-xs text-[hsl(var(--muted-foreground))]">{q.family}</span>
                    </td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{q.type}</td>
                    <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{q.region}</td>
                    <td className="px-4 py-3 min-w-[200px]">
                      <ProgressBar value={q.used} max={q.limit} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-[hsl(var(--foreground))]">{percent}%</td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[hsl(var(--border))] text-xs text-[hsl(var(--muted-foreground))]">
          Showing {filtered.length} of {DEMO_QUOTAS.length} quotas
        </div>
      </div>
    </div>
  );
}
