import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface Alert {
  model: string;
  used: number;
  limit: number;
  region: string;
}

export function AlertsBanner({ alerts }: { alerts: Alert[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const critical = alerts.filter(a => (a.used / a.limit) >= 0.9);
  const warning = alerts.filter(a => {
    const pct = a.used / a.limit;
    return pct >= 0.75 && pct < 0.9;
  });

  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 text-sm">
            Capacity Alerts
          </h4>
          <div className="mt-2 space-y-1">
            {critical.map(a => (
              <p key={a.model} className="text-sm text-red-700 dark:text-red-400">
                🔴 <strong>{a.model}</strong> in {a.region} — {Math.round((a.used / a.limit) * 100)}% utilized
              </p>
            ))}
            {warning.map(a => (
              <p key={a.model} className="text-sm text-yellow-700 dark:text-yellow-400">
                🟡 <strong>{a.model}</strong> in {a.region} — {Math.round((a.used / a.limit) * 100)}% utilized
              </p>
            ))}
          </div>
          <a
            href="https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 text-xs text-[hsl(var(--primary))] hover:underline"
          >
            Request quota increase in Azure Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
