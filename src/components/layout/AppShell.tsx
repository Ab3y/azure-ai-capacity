import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';
import { StatusBar } from './StatusBar';
import { useAppStore } from '@/store/useAppStore';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />

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
