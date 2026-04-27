import { ArrowUpDown } from 'lucide-react';
import { QuotaChangeGuide } from './QuotaChangeGuide';

export function CapacityChangePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <ArrowUpDown className="w-6 h-6 text-[hsl(var(--primary))]" />
          Manage Capacity
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Step-by-step guide to increase or decrease your Azure AI quota and capacity
        </p>
      </div>

      <QuotaChangeGuide />
    </div>
  );
}
