import { FlaskConical, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/auth/useAuth';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const setDemoMode = useAppStore((s) => s.setDemoMode);
  const { login } = useAuth();

  if (dismissed) return null;

  const handleConnect = async () => {
    try {
      await login();
      setDemoMode(false);
    } catch {
      // Login cancelled or failed — stay in demo mode
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-3 mb-4 flex items-center gap-3">
      <FlaskConical className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
          You're viewing the <span className="text-purple-600 dark:text-purple-400 font-semibold">Demo</span> — sample data is shown to help you understand Azure AI capacity management.
        </p>
      </div>
      <button
        onClick={handleConnect}
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[hsl(var(--primary))] rounded-lg hover:opacity-90 transition-opacity"
      >
        <LogIn className="w-3.5 h-3.5" />
        Connect to Azure
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
