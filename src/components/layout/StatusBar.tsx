import { Wifi, Clock, HelpCircle, FlaskConical } from 'lucide-react';
import { useAuth } from '@/auth/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { useState, useEffect } from 'react';

export function StatusBar() {
  const { user } = useAuth();
  const demoMode = useAppStore((s) => s.demoMode);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="h-8 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] flex items-center px-4 text-xs text-[hsl(var(--muted-foreground))] gap-4 shrink-0">
      {demoMode ? (
        <div className="flex items-center gap-1.5">
          <FlaskConical className="w-3 h-3 text-purple-500" />
          <span className="text-purple-600 dark:text-purple-400 font-medium">Demo Mode</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-[hsl(var(--success))]" />
          <span>Connected</span>
        </div>
      )}

      {user?.tenantId && (
        <span className="hidden sm:block">
          Tenant: {user.tenantId.substring(0, 8)}...
        </span>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <Clock className="w-3 h-3" />
        <span>Last refresh: {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      <a
        href="https://learn.microsoft.com/azure/ai-services/openai/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 hover:text-[hsl(var(--foreground))] transition-colors"
      >
        <HelpCircle className="w-3 h-3" />
        <span className="hidden sm:block">Azure AI Docs</span>
      </a>
    </footer>
  );
}
