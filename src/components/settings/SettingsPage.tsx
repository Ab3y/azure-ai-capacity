import { Settings, Sun, Moon, Monitor, RefreshCw, Shield, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/auth/useAuth';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const { theme, setTheme, refreshInterval, setRefreshInterval } = useAppStore();
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[hsl(var(--primary))]" />
          Settings
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Configure your dashboard preferences
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Account
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Name</span>
            <span className="text-[hsl(var(--foreground))]">{user?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Email</span>
            <span className="text-[hsl(var(--foreground))]">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[hsl(var(--muted-foreground))]">Tenant ID</span>
            <span className="text-[hsl(var(--foreground))] font-mono text-xs">{user?.tenantId || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Theme */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Appearance</h3>
        <div className="flex gap-2">
          {[
            { value: 'light' as const, icon: Sun, label: 'Light' },
            { value: 'dark' as const, icon: Moon, label: 'Dark' },
            { value: 'system' as const, icon: Monitor, label: 'System' },
          ].map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border',
                theme === value
                  ? 'bg-[hsl(var(--primary)/0.1)] border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
                  : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Refresh Interval */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4 flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Data Refresh
        </h3>
        <div className="flex items-center gap-4">
          <label className="text-sm text-[hsl(var(--muted-foreground))]">Auto-refresh interval:</label>
          <select
            value={refreshInterval}
            onChange={e => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-2 text-sm bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-lg text-[hsl(var(--foreground))]"
          >
            <option value={1}>Every 1 minute</option>
            <option value={5}>Every 5 minutes</option>
            <option value={10}>Every 10 minutes</option>
            <option value={15}>Every 15 minutes</option>
            <option value={30}>Every 30 minutes</option>
          </select>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Resources</h3>
        <div className="space-y-2">
          {[
            { label: 'Azure OpenAI Documentation', url: 'https://learn.microsoft.com/azure/ai-services/openai/' },
            { label: 'Quota Management Guide', url: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota' },
            { label: 'Azure Portal — Quotas', url: 'https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas' },
            { label: 'Well-Architected Framework for AI', url: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-openai' },
          ].map(link => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors group"
            >
              <span className="text-sm text-[hsl(var(--foreground))]">{link.label}</span>
              <ExternalLink className="w-4 h-4 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))]" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
