import { cn } from '@/lib/utils';
import { getUtilizationColor } from '@/utils/formatters';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ProgressBar({ value, max, showLabel = true, size = 'md', className }: ProgressBarProps) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = getUtilizationColor(percent);

  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1 text-[hsl(var(--muted-foreground))]">
          <span>{value.toLocaleString()} / {max.toLocaleString()}</span>
          <span style={{ color }}>{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn('w-full bg-[hsl(var(--muted))] rounded-full overflow-hidden', heights[size])}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
