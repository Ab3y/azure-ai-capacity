import { Rocket } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { cn } from '@/lib/utils';

const DEMO_DEPLOYMENTS = [
  { name: 'gpt4o-prod', account: 'myoai-eastus', model: 'gpt-4o', version: '2024-11-20', sku: 'Standard', capacity: 120, region: 'East US', state: 'Succeeded', created: '2024-09-15' },
  { name: 'gpt4o-mini-prod', account: 'myoai-eastus', model: 'gpt-4o-mini', version: '2024-07-18', sku: 'Standard', capacity: 150, region: 'East US', state: 'Succeeded', created: '2024-08-20' },
  { name: 'gpt41-test', account: 'myoai-sweden', model: 'gpt-4.1', version: '2025-04-14', sku: 'Global Standard', capacity: 50, region: 'Sweden Central', state: 'Succeeded', created: '2025-04-16' },
  { name: 'o3-reasoning', account: 'myoai-eastus2', model: 'o3', version: '2025-04-16', sku: 'Standard', capacity: 30, region: 'East US 2', state: 'Succeeded', created: '2025-04-17' },
  { name: 'embed-large', account: 'myoai-westus', model: 'text-embedding-3-large', version: '1', sku: 'Standard', capacity: 500, region: 'West US', state: 'Succeeded', created: '2024-06-01' },
  { name: 'gpt4-turbo-legacy', account: 'myoai-uksouth', model: 'gpt-4-turbo', version: '2024-04-09', sku: 'Provisioned', capacity: 100, region: 'UK South', state: 'Succeeded', created: '2024-05-10' },
  { name: 'dalle3-images', account: 'myoai-eastus', model: 'dall-e-3', version: '3.0', sku: 'Standard', capacity: 6, region: 'East US', state: 'Succeeded', created: '2024-10-01' },
  { name: 'claude-sonnet-test', account: 'foundry-eastus', model: 'claude-4-sonnet', version: '20250414', sku: 'Serverless', capacity: 100, region: 'East US', state: 'Succeeded', created: '2025-04-15' },
  { name: 'gpt4o-staging', account: 'myoai-eastus', model: 'gpt-4o', version: '2024-11-20', sku: 'Standard', capacity: 40, region: 'East US', state: 'Creating', created: '2025-04-27' },
];

type ViewMode = 'cards' | 'table';

export function DeploymentsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [groupBy, setGroupBy] = useState<'none' | 'account' | 'region' | 'model'>('none');

  const grouped = groupBy === 'none'
    ? { 'All Deployments': DEMO_DEPLOYMENTS }
    : DEMO_DEPLOYMENTS.reduce((acc, d) => {
        const key = groupBy === 'account' ? d.account : groupBy === 'region' ? d.region : d.model;
        (acc[key] = acc[key] || []).push(d);
        return acc;
      }, {} as Record<string, typeof DEMO_DEPLOYMENTS>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Rocket className="w-6 h-6 text-[hsl(var(--primary))]" />
            Deployments
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Active Azure AI model deployments across all accounts
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={groupBy}
            onChange={e => setGroupBy(e.target.value as typeof groupBy)}
            className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
          >
            <option value="none">No Grouping</option>
            <option value="account">By Account</option>
            <option value="region">By Region</option>
            <option value="model">By Model</option>
          </select>
          <div className="flex bg-[hsl(var(--muted))] rounded-lg p-0.5">
            <button onClick={() => setViewMode('cards')} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', viewMode === 'cards' ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm' : 'text-[hsl(var(--muted-foreground))]')}>Cards</button>
            <button onClick={() => setViewMode('table')} className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors', viewMode === 'table' ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm' : 'text-[hsl(var(--muted-foreground))]')}>Table</button>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([group, deployments]) => (
        <div key={group}>
          {groupBy !== 'none' && (
            <h3 className="text-sm font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">{group} ({deployments.length})</h3>
          )}
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {deployments.map(d => (
                <div key={d.name} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-[hsl(var(--foreground))]">{d.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))]">{d.account}</p>
                    </div>
                    <StatusBadge status={d.state} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-[hsl(var(--muted-foreground))]">Model:</span> <span className="text-[hsl(var(--foreground))] font-medium">{d.model}</span></div>
                    <div><span className="text-[hsl(var(--muted-foreground))]">Version:</span> <span className="text-[hsl(var(--foreground))]">{d.version}</span></div>
                    <div><span className="text-[hsl(var(--muted-foreground))]">SKU:</span> <span className="text-[hsl(var(--foreground))]">{d.sku}</span></div>
                    <div><span className="text-[hsl(var(--muted-foreground))]">Capacity:</span> <span className="text-[hsl(var(--foreground))] font-medium">{d.capacity}K TPM</span></div>
                    <div><span className="text-[hsl(var(--muted-foreground))]">Region:</span> <span className="text-[hsl(var(--foreground))]">{d.region}</span></div>
                    <div><span className="text-[hsl(var(--muted-foreground))]">Created:</span> <span className="text-[hsl(var(--foreground))]">{d.created}</span></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                      <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Model</th>
                      <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">SKU</th>
                      <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Capacity</th>
                      <th className="text-left px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Region</th>
                      <th className="text-center px-4 py-3 font-medium text-[hsl(var(--muted-foreground))]">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deployments.map(d => (
                      <tr key={d.name} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)]">
                        <td className="px-4 py-3"><span className="font-medium text-[hsl(var(--foreground))]">{d.name}</span><span className="block text-xs text-[hsl(var(--muted-foreground))]">{d.account}</span></td>
                        <td className="px-4 py-3 text-[hsl(var(--foreground))]">{d.model} <span className="text-xs text-[hsl(var(--muted-foreground))]">v{d.version}</span></td>
                        <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{d.sku}</td>
                        <td className="px-4 py-3 font-medium text-[hsl(var(--foreground))]">{d.capacity}K TPM</td>
                        <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{d.region}</td>
                        <td className="px-4 py-3 text-center"><StatusBadge status={d.state} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
