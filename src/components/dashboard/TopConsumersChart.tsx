import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getUtilizationColor } from '@/utils/formatters';

interface QuotaData {
  model: string;
  used: number;
  limit: number;
}

export function TopConsumersChart({ data }: { data: QuotaData[] }) {
  const sorted = [...data]
    .map(d => ({
      name: d.model,
      utilization: Math.round((d.used / d.limit) * 100),
      used: d.used,
      limit: d.limit,
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 6);

  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
      <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Top Quota Utilization</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={v => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [`${value}%`, 'Utilization']}
            />
            <Bar dataKey="utilization" radius={[0, 4, 4, 0]} maxBarSize={24}>
              {sorted.map((entry, index) => (
                <Cell key={index} fill={getUtilizationColor(entry.utilization)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
