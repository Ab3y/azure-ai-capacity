import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

export function MetricCard({ title, value, subtitle, icon, trend, className }: MetricCardProps) {
  return (
    <div className={cn(
      'bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 transition-shadow hover:shadow-md',
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{title}</p>
        {icon && (
          <div className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]">
            {icon}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[hsl(var(--foreground))]">{value}</p>
      {subtitle && (
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">{subtitle}</p>
      )}
      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-medium',
          trend.value >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        )}>
          <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
          <span className="text-[hsl(var(--muted-foreground))]">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
