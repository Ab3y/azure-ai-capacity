import { FolderOpen } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-[hsl(var(--muted-foreground))] mb-4">
        {icon || <FolderOpen className="w-12 h-12" />}
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">{title}</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-md mb-4">{description}</p>
      {action}
    </div>
  );
}
