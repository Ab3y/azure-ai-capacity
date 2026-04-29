import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { useAppStore } from '@/store/useAppStore';
import { useCustomerDataStore } from '@/store/useCustomerDataStore';
import { Building2, X } from 'lucide-react';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const { data, isCustomerLoaded } = useCustomerDataStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Customer Banner */}
      {isCustomerLoaded && !bannerDismissed && (
        <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-1.5 flex items-center gap-2 shrink-0">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
            Viewing: <strong>{data.meta.customerName}</strong>
          </span>
          {data.meta.preparedBy && (
            <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">
              · Prepared by {data.meta.preparedBy}
            </span>
          )}
          <div className="flex-1" />
          <button onClick={() => setBannerDismissed(true)} className="text-blue-500/50 hover:text-blue-500">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <SideNav
          collapsed={sidebarCollapsed}
          currentPath={location.pathname}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-auto bg-[hsl(var(--muted)/0.3)] p-4 lg:p-6">
          {children}
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
