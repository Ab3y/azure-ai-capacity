import { Globe, MapPin } from 'lucide-react';
import { AZURE_REGIONS, GEOGRAPHIES } from '@/data/regionData';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCustomerDataStore } from '@/store/useCustomerDataStore';

function getRegionColor(utilization: number): string {
  if (utilization >= 90) return 'bg-red-500 text-white';
  if (utilization >= 75) return 'bg-yellow-500 text-white';
  if (utilization >= 50) return 'bg-blue-500 text-white';
  if (utilization > 0) return 'bg-green-500 text-white';
  return 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]';
}

export function RegionsPage() {
  const { data } = useCustomerDataStore();
  const [geoFilter, setGeoFilter] = useState('all');

  const regionUsage: Record<string, { deployments: number; utilization: number }> = {};
  data.regions.forEach(r => { regionUsage[r.name] = { deployments: r.deployments, utilization: r.utilization }; });

  const filteredRegions = AZURE_REGIONS.filter(r =>
    geoFilter === 'all' || r.geography === geoFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <Globe className="w-6 h-6 text-[hsl(var(--primary))]" />
            Regional Availability
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Azure AI service availability and utilization by region
          </p>
        </div>
        <select
          value={geoFilter}
          onChange={e => setGeoFilter(e.target.value)}
          className="px-3 py-2 text-sm bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
        >
          <option value="all">All Geographies</option>
          {GEOGRAPHIES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Region Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRegions.map(region => {
          const usage = regionUsage[region.name];
          const utilization = usage?.utilization || 0;
          const deployments = usage?.deployments || 0;

          return (
            <div
              key={region.name}
              className={cn(
                'bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4 hover:shadow-md transition-shadow',
                deployments === 0 && 'opacity-60'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[hsl(var(--foreground))] text-sm">{region.displayName}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">{region.geography}</p>
                </div>
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getRegionColor(utilization))}>
                  {deployments > 0 ? `${utilization}%` : 'No deployments'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {deployments} deployments
                </span>
                {region.hasOpenAI && (
                  <span className="text-[hsl(var(--primary))]">OpenAI ✓</span>
                )}
              </div>
              {deployments > 0 && (
                <div className="mt-2 w-full bg-[hsl(var(--muted))] rounded-full h-1.5">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${utilization}%`,
                      backgroundColor: utilization >= 90 ? 'hsl(var(--critical))' : utilization >= 75 ? 'hsl(var(--warning))' : 'hsl(var(--success))',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-green-500" /> &lt;50%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500" /> 50-74%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-500" /> 75-89%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> ≥90%</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[hsl(var(--muted))]" /> No deployments</span>
      </div>
    </div>
  );
}
