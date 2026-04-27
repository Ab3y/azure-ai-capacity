import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'healthy' | 'warning' | 'critical' | 'error' | string;
  label?: string;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  healthy: { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  error: { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  Succeeded: { bg: 'bg-green-500/10', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  Creating: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  Failed: { bg: 'bg-red-500/10', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
};

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.healthy;
  const displayLabel = label || status;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium capitalize',
        style.bg,
        style.text,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
    >
      <span className={cn('rounded-full', style.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {displayLabel}
    </span>
  );
}
