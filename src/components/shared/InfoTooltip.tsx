import { ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { TooltipData } from '@/types/app';

interface InfoTooltipProps {
  data: TooltipData;
  children: React.ReactNode;
}

export function InfoTooltip({ data, children }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[hsl(var(--popover))] text-[hsl(var(--popover-foreground))] border border-[hsl(var(--border))] rounded-lg shadow-lg text-sm">
          <p className="font-semibold mb-1">{data.title}</p>
          <p className="text-[hsl(var(--muted-foreground))] text-xs mb-2">{data.description}</p>
          {data.bestPractice && (
            <p className="text-xs text-[hsl(var(--primary))] mb-2">
              💡 {data.bestPractice}
            </p>
          )}
          <a
            href={data.docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline"
          >
            Learn more <ExternalLink className="w-3 h-3" />
          </a>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-[hsl(var(--border))]" />
        </div>
      )}
    </div>
  );
}
