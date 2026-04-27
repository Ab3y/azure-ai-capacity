import { TrendingUp, Calendar } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';

const TREND_DATA = [
  { date: 'Mar 1', 'GPT-4o': 120, 'GPT-4o-mini': 60, 'GPT-4.1': 0, 'o3': 10 },
  { date: 'Mar 8', 'GPT-4o': 135, 'GPT-4o-mini': 65, 'GPT-4.1': 0, 'o3': 12 },
  { date: 'Mar 15', 'GPT-4o': 142, 'GPT-4o-mini': 70, 'GPT-4.1': 0, 'o3': 15 },
  { date: 'Mar 22', 'GPT-4o': 150, 'GPT-4o-mini': 75, 'GPT-4.1': 10, 'o3': 18 },
  { date: 'Mar 29', 'GPT-4o': 160, 'GPT-4o-mini': 80, 'GPT-4.1': 20, 'o3': 20 },
  { date: 'Apr 5', 'GPT-4o': 165, 'GPT-4o-mini': 85, 'GPT-4.1': 30, 'o3': 22 },
  { date: 'Apr 12', 'GPT-4o': 170, 'GPT-4o-mini': 88, 'GPT-4.1': 38, 'o3': 25 },
  { date: 'Apr 19', 'GPT-4o': 175, 'GPT-4o-mini': 92, 'GPT-4.1': 42, 'o3': 27 },
  { date: 'Apr 26', 'GPT-4o': 180, 'GPT-4o-mini': 95, 'GPT-4.1': 45, 'o3': 28 },
];

const COLORS = ['hsl(217, 91%, 60%)', 'hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(270, 70%, 60%)'];

export function AnalyticsPage() {
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
            <AreaChart data={TREND_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <defs>
                {['GPT-4o', 'GPT-4o-mini', 'GPT-4.1', 'o3'].map((key, i) => (
                  <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {['GPT-4o', 'GPT-4o-mini', 'GPT-4.1', 'o3'].map((key, i) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[i]} fill={`url(#gradient-${key})`} strokeWidth={2} dot={false} />
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
