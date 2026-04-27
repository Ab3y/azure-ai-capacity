import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  selectedSubscriptionIds: string[];
  selectedRegions: string[];
  refreshInterval: number;
  demoMode: boolean;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedSubscriptionIds: (ids: string[]) => void;
  setSelectedRegions: (regions: string[]) => void;
  setRefreshInterval: (minutes: number) => void;
  setDemoMode: (demo: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      selectedSubscriptionIds: [],
      selectedRegions: [],
      refreshInterval: 5,
      demoMode: false,

      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setSelectedSubscriptionIds: (ids) => set({ selectedSubscriptionIds: ids }),
      setSelectedRegions: (regions) => set({ selectedRegions: regions }),
      setRefreshInterval: (minutes) => set({ refreshInterval: minutes }),
      setDemoMode: (demo) => set({ demoMode: demo }),
    }),
    {
      name: 'azure-ai-capacity-settings',
    }
  )
);
