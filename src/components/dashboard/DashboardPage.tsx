import { LayoutDashboard, Cpu, Globe, AlertTriangle } from 'lucide-react';
import { MetricCard } from '@/components/shared/MetricCard';
import { UsageGauge } from './UsageGauge';
import { AlertsBanner } from './AlertsBanner';
import { TopConsumersChart } from './TopConsumersChart';
import { UtilizationHeatmap } from './UtilizationHeatmap';
import { useCustomerDataStore } from '@/store/useCustomerDataStore';

export function DashboardPage() {
  const { data } = useCustomerDataStore();
  const quotas = data.quotas.map(q => ({ model: q.model, used: q.used, limit: q.limit, region: q.region }));
  const alerts = quotas.filter(q => (q.used / q.limit) >= 0.75);

  const totalModels = quotas.length;
  const avgUtilization = quotas.length > 0 ? Math.round(
    quotas.reduce((sum, q) => sum + (q.used / q.limit) * 100, 0) / quotas.length
  ) : 0;
  const regions = [...new Set(quotas.map(q => q.region))].length;
  const criticalCount = quotas.filter(q => (q.used / q.limit) >= 0.9).length;

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
      {alerts.length > 0 && <AlertsBanner alerts={alerts} />}

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
          {quotas.map((q, i) => (
            <UsageGauge
              key={`${q.model}-${q.region}-${i}`}
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
        <TopConsumersChart data={quotas} />
        <UtilizationHeatmap />
      </div>
    </div>
  );
}
