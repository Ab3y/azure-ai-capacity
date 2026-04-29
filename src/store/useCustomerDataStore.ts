import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_DEMO_DATA, CONTOSO_TEMPLATE } from '@/data/defaultDemoData';
import type { CustomerConfig } from '@/data/defaultDemoData';

interface CustomerDataState {
  data: CustomerConfig;
  isCustomerLoaded: boolean;
  loadedFrom: 'demo' | 'upload';

  loadCustomerData: (config: CustomerConfig) => void;
  resetToDemo: () => void;
  getTemplate: () => CustomerConfig;
  exportCurrent: () => CustomerConfig;
}

export const useCustomerDataStore = create<CustomerDataState>()(
  persist(
    (set, get) => ({
      data: DEFAULT_DEMO_DATA,
      isCustomerLoaded: false,
      loadedFrom: 'demo',

      loadCustomerData: (config: CustomerConfig) => {
        // Auto-derive regions from quotas if not provided
        if (!config.regions || config.regions.length === 0) {
          const regionMap = new Map<string, { deployments: number; totalUsage: number; totalLimit: number }>();
          for (const q of config.quotas) {
            if (q.region === 'Global' || q.region === 'US DataZone') continue;
            const key = q.region.toLowerCase().replace(/\s+/g, '');
            const existing = regionMap.get(key) || { deployments: 0, totalUsage: 0, totalLimit: 0 };
            existing.deployments += 1;
            existing.totalUsage += q.used;
            existing.totalLimit += q.limit;
            regionMap.set(key, existing);
          }
          config.regions = Array.from(regionMap.entries()).map(([name, data]) => ({
            name,
            deployments: data.deployments,
            utilization: data.totalLimit > 0 ? Math.round((data.totalUsage / data.totalLimit) * 100) : 0,
          }));
        }

        // Auto-derive trends placeholder if not provided
        if (!config.trends || config.trends.length === 0) {
          config.trends = [];
        }

        set({
          data: config,
          isCustomerLoaded: config.meta.customerName !== 'Demo Company',
          loadedFrom: 'upload',
        });
      },

      resetToDemo: () => {
        set({
          data: DEFAULT_DEMO_DATA,
          isCustomerLoaded: false,
          loadedFrom: 'demo',
        });
      },

      getTemplate: () => CONTOSO_TEMPLATE,

      exportCurrent: () => get().data,
    }),
    {
      name: 'azure-ai-capacity-customer-data',
    }
  )
);
