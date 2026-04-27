import { Routes, Route, Navigate } from 'react-router-dom';
import { useIsAuthenticated } from '@azure/msal-react';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/components/layout/LoginPage';
import { DashboardPage } from '@/components/dashboard/DashboardPage';
import { QuotaPage } from '@/components/quotas/QuotaPage';
import { DeploymentsPage } from '@/components/deployments/DeploymentsPage';
import { AnalyticsPage } from '@/components/analytics/AnalyticsPage';
import { RegionsPage } from '@/components/regions/RegionsPage';
import { GuidesPage } from '@/components/guides/GuidesPage';
import { CapacityChangePage } from '@/components/guides/CapacityChangePage';
import { SettingsPage } from '@/components/settings/SettingsPage';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { DemoBanner } from '@/components/layout/DemoBanner';
import { useAppStore } from '@/store/useAppStore';
import { Toaster } from 'sonner';

export function App() {
  const isAuthenticated = useIsAuthenticated();
  const demoMode = useAppStore((s) => s.demoMode);

  const hasAccess = isAuthenticated || demoMode;

  if (!hasAccess) {
    return (
      <ThemeProvider>
        <LoginPage />
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AppShell>
        {demoMode && <DemoBanner />}
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/quotas" element={<QuotaPage />} />
          <Route path="/deployments" element={<DeploymentsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/capacity" element={<CapacityChangePage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
      <Toaster richColors position="bottom-right" />
    </ThemeProvider>
  );
}
