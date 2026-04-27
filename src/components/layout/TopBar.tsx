import { Sun, Moon, Monitor, Menu, RefreshCw, User, LogOut, FlaskConical } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/auth/useAuth';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { theme, setTheme, demoMode, setDemoMode } = useAppStore();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const themeOptions = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <header className="h-14 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] flex items-center px-4 gap-4 shrink-0">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-[hsl(var(--foreground))] hidden sm:flex items-center gap-2">
        Azure AI Capacity Dashboard
        <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 px-1.5 py-0.5 rounded-full">
          Beta
        </span>
      </h1>

      <div className="flex-1" />

      {/* Theme Toggle */}
      <div className="flex items-center bg-[hsl(var(--muted))] rounded-lg p-0.5">
        {themeOptions.map(({ value, icon: Icon, label }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              'p-1.5 rounded-md transition-colors',
              theme === value
                ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm'
                : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
            )}
            title={label}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}
      </div>

      {/* Refresh */}
      <button
        className="p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        title="Refresh data"
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      {/* User Menu */}
      {demoMode ? (
        <button
          onClick={() => setDemoMode(false)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 text-purple-700 dark:text-purple-400 text-sm font-medium hover:bg-purple-500/10 transition-colors"
        >
          <FlaskConical className="w-4 h-4" />
          <span className="hidden sm:block">Exit Demo</span>
        </button>
      ) : (
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-[hsl(var(--foreground))] hidden md:block max-w-[120px] truncate">
            {user?.name || user?.email || 'User'}
          </span>
        </button>

        {userMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
            <div className="absolute right-0 top-full mt-1 w-56 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg shadow-lg z-50 py-1">
              <div className="px-3 py-2 border-b border-[hsl(var(--border))]">
                <p className="text-sm font-medium text-[hsl(var(--foreground))]">{user?.name}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => { logout(); setUserMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[hsl(var(--destructive))] hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
      )}
    </header>
  );
}
