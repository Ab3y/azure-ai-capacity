import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

export function SkeletonLoader({ className, count = 1 }: SkeletonLoaderProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-[hsl(var(--muted))] rounded-lg',
            className
          )}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
      <SkeletonLoader className="h-4 w-24 mb-3" />
      <SkeletonLoader className="h-8 w-20 mb-2" />
      <SkeletonLoader className="h-3 w-32" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[hsl(var(--border))]">
        <SkeletonLoader className="h-8 w-48" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 px-4 py-3 border-b border-[hsl(var(--border))] last:border-0">
          <SkeletonLoader className="h-5 w-32" />
          <SkeletonLoader className="h-5 w-24" />
          <SkeletonLoader className="h-5 w-20" />
          <SkeletonLoader className="h-5 flex-1" />
          <SkeletonLoader className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}
