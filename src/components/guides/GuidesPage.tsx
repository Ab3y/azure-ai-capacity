import { BookOpen, ExternalLink, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { BEST_PRACTICES, PRACTICE_CATEGORIES } from '@/data/bestPractices';
import { useState } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { QuotaChangeGuide } from './QuotaChangeGuide';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  gauge: Icons.Gauge,
  rocket: Icons.Rocket,
  repeat: Icons.Repeat,
  globe: Icons.Globe,
  zap: Icons.Zap,
  shield: Icons.Shield,
  calendar: Icons.Calendar,
  network: Icons.Network,
  coins: Icons.Coins,
  building: Icons.Building,
};

type ViewMode = 'guides' | 'capacity';

export function GuidesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('guides');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const categories = ['all', ...PRACTICE_CATEGORIES];

  const filtered = categoryFilter === 'all'
    ? BEST_PRACTICES
    : BEST_PRACTICES.filter(bp => bp.category === categoryFilter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-[hsl(var(--primary))]" />
          Best Practices & Guides
        </h2>
        <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
          Curated guidance from Microsoft Learn for Azure AI capacity management
        </p>
      </div>

      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b border-[hsl(var(--border))] pb-0">
        <button
          onClick={() => setViewMode('guides')}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px',
            viewMode === 'guides'
              ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
              : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
          )}
        >
          Best Practices
        </button>
        <button
          onClick={() => setViewMode('capacity')}
          className={cn(
            'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px flex items-center gap-1.5',
            viewMode === 'capacity'
              ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]'
              : 'border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
          )}
        >
          <ArrowUpCircle className="w-4 h-4" />
          Manage Capacity
          <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full font-medium">
            Guide
          </span>
        </button>
      </div>

      {viewMode === 'capacity' ? (
        <QuotaChangeGuide />
      ) : (
        <>
          {/* Capacity Quick CTA Banner */}
          <button
            onClick={() => setViewMode('capacity')}
            className="w-full bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <ArrowDownCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">
                Need to Change Your Capacity?
              </h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                Step-by-step walkthrough to increase or decrease your Azure AI quota — Azure Portal, CLI commands, and support ticket guidance included.
              </p>
            </div>
            <Icons.ArrowRight className="w-5 h-5 text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--primary))] transition-colors shrink-0" />
          </button>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                  categoryFilter === cat
                    ? 'bg-[hsl(var(--primary))] text-white'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                )}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {/* Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map(bp => {
              const Icon = iconMap[bp.icon] || Icons.BookOpen;
              return (
                <div key={bp.id} className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[hsl(var(--foreground))] text-sm">{bp.title}</h3>
                      <span className="text-xs text-[hsl(var(--primary))]">{bp.category}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[hsl(var(--foreground))] mb-2">{bp.summary}</p>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3">{bp.details}</p>
                  <a
                    href={bp.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--primary))] hover:underline"
                  >
                    Read on Microsoft Learn <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
