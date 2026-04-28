import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Table2,
  Rocket,
  TrendingUp,
  Globe,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Brain,
  ArrowUpDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Quotas', path: '/quotas', icon: Table2 },
  { label: 'Deployments', path: '/deployments', icon: Rocket },
  { label: 'Analytics', path: '/analytics', icon: TrendingUp },
  { label: 'Regions', path: '/regions', icon: Globe },
  { label: 'Manage Capacity', path: '/capacity', icon: ArrowUpDown },
  { label: 'Lead Times', path: '/lead-times', icon: Clock },
  { label: 'Best Practices', path: '/guides', icon: BookOpen },
  { label: 'Audit Log', path: '/admin/audit', icon: ShieldCheck },
  { label: 'Settings', path: '/settings', icon: Settings },
];

interface SideNavProps {
  collapsed: boolean;
  currentPath: string;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function SideNav({ collapsed, currentPath, mobileOpen, onMobileClose }: SideNavProps) {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'bg-[hsl(var(--card))] border-r border-[hsl(var(--border))] flex flex-col transition-all duration-200 z-40',
        collapsed ? 'w-16' : 'w-56',
        'hidden lg:flex',
        mobileOpen && 'fixed inset-y-0 left-0 flex lg:relative w-56'
      )}
    >
      {/* Logo */}
      <div className="h-14 flex items-center gap-2 px-4 border-b border-[hsl(var(--border))]">
        <Brain className="w-6 h-6 text-[hsl(var(--primary))] shrink-0" />
        {!collapsed && (
          <span className="font-semibold text-sm text-[hsl(var(--foreground))] truncate">
            AI Capacity
          </span>
        )}
        {!collapsed && (
          <span className="text-[8px] font-bold uppercase tracking-wider bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30 px-1 py-px rounded-full leading-none">
            Beta
          </span>
        )}
        <button
          onClick={onMobileClose}
          className="ml-auto lg:hidden text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="hidden lg:flex border-t border-[hsl(var(--border))] p-2">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
