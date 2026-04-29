import { TrendingUp, Calendar } from 'lucide-react';
import { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { useCustomerDataStore } from '@/store/useCustomerDataStore';

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(270, 70%, 60%)', 'hsl(0, 84%, 60%)', 'hsl(180, 70%, 40%)'];

export function AnalyticsPage() {
  const { data } = useCustomerDataStore();

  const chartData = useMemo(() =>
    data.trends.map(t => ({ date: t.date, ...t.models })),
    [data.trends]
  );

  const modelKeys = useMemo(() => {
    const keys = new Set<string>();
    data.trends.forEach(t => Object.keys(t.models).forEach(k => keys.add(k)));
    return Array.from(keys);
  }, [data.trends]);

  if (data.trends.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[hsl(var(--primary))]" />
            Analytics
          </h2>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Usage trends, growth projections, and capacity analytics
          </p>
        </div>
        <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-8 text-center text-[hsl(var(--muted-foreground))]">
          No trend data available. Upload a customer JSON with trend data to see usage over time.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[hsl(var(--primary))]" />
          Analytics
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Usage trends, growth projections, and capacity analytics
        </p>
      </div>

      {/* Usage Trends Chart */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Usage Trends (K TPM)</h3>
          <div className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
            <Calendar className="w-3.5 h-3.5" /> Last 8 weeks
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                {modelKeys.map((key, i) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS[i % COLORS.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {modelKeys.map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i % COLORS.length]} fill={`url(#gradient-${key})`} strokeWidth={2} dot={false} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Growth Projection */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Growth Projection — GPT-4o</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[hsl(var(--muted)/0.5)] rounded-lg">
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Current Usage</p>
            <p className="text-xl font-bold text-[hsl(var(--foreground))]">180K TPM</p>
          </div>
          <div className="p-4 bg-[hsl(var(--muted)/0.5)] rounded-lg">
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-1">Weekly Growth Rate</p>
            <p className="text-xl font-bold text-[hsl(var(--primary))]">+3.2%</p>
          </div>
          <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-1">Projected to Hit Limit</p>
            <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300">~6 weeks</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">at current growth rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
