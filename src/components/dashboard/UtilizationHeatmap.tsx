import { getUtilizationColor } from '@/utils/formatters';

const DEMO_HEATMAP: { model: string; regions: Record<string, number> }[] = [
  { model: 'GPT-4o', regions: { 'East US': 75, 'West US': 45, 'Sweden Central': 30, 'UK South': 60 } },
  { model: 'GPT-4o-mini', regions: { 'East US': 32, 'West US': 55, 'Sweden Central': 20, 'UK South': 40 } },
  { model: 'GPT-4.1', regions: { 'East US': 56, 'West US': 0, 'Sweden Central': 90, 'UK South': 0 } },
  { model: 'o3', regions: { 'East US': 93, 'West US': 0, 'Sweden Central': 0, 'UK South': 0 } },
  { model: 'Embeddings', regions: { 'East US': 50, 'West US': 40, 'Sweden Central': 25, 'UK South': 35 } },
];

const REGIONS = ['East US', 'West US', 'Sweden Central', 'UK South'];

export function UtilizationHeatmap() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">
        Utilization Heatmap
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left p-2 text-[hsl(var(--muted-foreground))] font-medium">Model</th>
              {REGIONS.map(r => (
                <th key={r} className="text-center p-2 text-[hsl(var(--muted-foreground))] font-medium">{r}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEMO_HEATMAP.map(row => (
              <tr key={row.model}>
                <td className="p-2 font-medium text-[hsl(var(--foreground))]">{row.model}</td>
                {REGIONS.map(region => {
                  const value = row.regions[region] || 0;
                  return (
                    <td key={region} className="p-1 text-center">
                      {value > 0 ? (
                        <div
                          className="rounded-md py-1.5 px-2 text-white font-medium text-xs mx-auto"
                          style={{ backgroundColor: getUtilizationColor(value), minWidth: '3rem' }}
                          title={`${row.model} in ${region}: ${value}%`}
                        >
                          {value}%
                        </div>
                      ) : (
                        <div className="rounded-md py-1.5 px-2 bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] text-xs mx-auto" style={{ minWidth: '3rem' }}>
                          —
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-[hsl(var(--muted-foreground))]">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--success))' }} /> &lt;50%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--chart-1))' }} /> 50-74%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--warning))' }} /> 75-89%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(var(--critical))' }} /> ≥90%</span>
      </div>
    </div>
  );
}
