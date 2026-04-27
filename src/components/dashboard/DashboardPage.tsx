import { LayoutDashboard, Cpu, Globe, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { UsageGauge } from './UsageGauge';
import { AlertsBanner } from './AlertsBanner';
import { TopConsumersChart } from './TopConsumersChart';
import { UtilizationHeatmap } from './UtilizationHeatmap';

// Demo data for initial visual rendering before Azure connection
const DEMO_QUOTAS = [
  { model: 'GPT-4o', used: 180000, limit: 240000, region: 'East US' },
  { model: 'GPT-4o-mini', used: 95000, limit: 300000, region: 'East US' },
  { model: 'GPT-4.1', used: 45000, limit: 80000, region: 'Sweden Central' },
  { model: 'o3', used: 28000, limit: 30000, region: 'East US 2' },
  { model: 'text-embedding-3-large', used: 500000, limit: 1000000, region: 'West US' },
  { model: 'GPT-4 Turbo', used: 12000, limit: 80000, region: 'UK South' },
  { model: 'Claude 4 Sonnet', used: 60000, limit: 100000, region: 'East US' },
  { model: 'Llama 4 Scout', used: 15000, limit: 50000, region: 'West US 3' },
];

const ALERTS = DEMO_QUOTAS.filter(q => (q.used / q.limit) >= 0.75);

export function DashboardPage() {
  const totalModels = DEMO_QUOTAS.length;
  const avgUtilization = Math.round(
    DEMO_QUOTAS.reduce((sum, q) => sum + (q.used / q.limit) * 100, 0) / DEMO_QUOTAS.length
  );
  const regions = [...new Set(DEMO_QUOTAS.map(q => q.region))].length;
  const criticalCount = DEMO_QUOTAS.filter(q => (q.used / q.limit) >= 0.9).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <LayoutDashboard className="w-6 h-6 text-[hsl(var(--primary))]" />
          Dashboard
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Overview of your Azure AI capacity across all subscriptions
        </p>
      </div>

      {/* Alerts Banner */}
      {ALERTS.length > 0 && <AlertsBanner alerts={ALERTS} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Models Deployed"
          value={totalModels}
          subtitle="Across all subscriptions"
          icon={<Cpu className="w-5 h-5" />}
        />
        <MetricCard
          title="Avg. Utilization"
          value={`${avgUtilization}%`}
          subtitle="Capacity in use"
          icon={<LayoutDashboard className="w-5 h-5" />}
          trend={{ value: 5, label: 'vs last week' }}
        />
        <MetricCard
          title="Active Regions"
          value={regions}
          subtitle="With deployments"
          icon={<Globe className="w-5 h-5" />}
        />
        <MetricCard
          title="Critical Alerts"
          value={criticalCount}
          subtitle={criticalCount > 0 ? 'Quotas above 90%' : 'All quotas healthy'}
          icon={<AlertTriangle className="w-5 h-5" />}
        />
      </div>

      {/* Usage Gauges */}
      <div>
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">Quota Utilization by Model</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEMO_QUOTAS.map((q) => (
            <UsageGauge
              key={q.model}
              label={q.model}
              used={q.used}
              limit={q.limit}
              region={q.region}
            />
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopConsumersChart data={DEMO_QUOTAS} />
        <UtilizationHeatmap />
      </div>
    </div>
  );
}
