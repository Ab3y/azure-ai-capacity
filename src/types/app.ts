export interface AlertThreshold {
  id: string;
  modelPattern: string;
  warningPercent: number;
  criticalPercent: number;
  enabled: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number; // minutes
  defaultRegion: string;
  alertThresholds: AlertThreshold[];
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

export type UtilizationLevel = 'low' | 'medium' | 'high' | 'critical';

export interface TooltipData {
  title: string;
  description: string;
  docsUrl: string;
  bestPractice?: string;
}
