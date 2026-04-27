export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatTPM(value: number): string {
  return `${formatNumber(value)} TPM`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getUtilizationColor(percent: number): string {
  if (percent >= 90) return 'hsl(var(--critical))';
  if (percent >= 75) return 'hsl(var(--warning))';
  if (percent >= 50) return 'hsl(var(--chart-1))';
  return 'hsl(var(--success))';
}

export function getUtilizationStatus(percent: number): 'healthy' | 'warning' | 'critical' {
  if (percent >= 90) return 'critical';
  if (percent >= 75) return 'warning';
  return 'healthy';
}

export function getHealthColor(health: 'healthy' | 'warning' | 'error'): string {
  switch (health) {
    case 'healthy': return 'hsl(var(--success))';
    case 'warning': return 'hsl(var(--warning))';
    case 'error': return 'hsl(var(--critical))';
  }
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
