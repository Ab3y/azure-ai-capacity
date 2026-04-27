export interface AzureSubscription {
  subscriptionId: string;
  displayName: string;
  state: string;
  tenantId: string;
}

export interface QuotaUsage {
  id: string;
  name: { value: string; localizedValue: string };
  currentValue: number;
  limit: number;
  unit: string;
  status?: string;
}

export interface CognitiveAccount {
  id: string;
  name: string;
  type: string;
  location: string;
  kind: string;
  properties: {
    endpoint: string;
    provisioningState: string;
  };
  sku: { name: string; tier?: string };
}

export interface Deployment {
  id: string;
  name: string;
  properties: {
    model: {
      format: string;
      name: string;
      version: string;
    };
    provisioningState: string;
    raiPolicyName?: string;
    versionUpgradeOption?: string;
    currentCapacity?: number;
    capabilities?: Record<string, string>;
    rateLimits?: RateLimit[];
  };
  sku: {
    name: string;
    capacity: number;
  };
}

export interface RateLimit {
  key: string;
  renewalPeriod: number;
  count: number;
}

export interface QuotaItem {
  modelName: string;
  modelFamily: string;
  deploymentType: string;
  region: string;
  accountName: string;
  limit: number;
  currentUsage: number;
  usagePercent: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
}

export interface DeploymentItem {
  id: string;
  name: string;
  accountName: string;
  modelName: string;
  modelVersion: string;
  modelFormat: string;
  region: string;
  skuName: string;
  capacity: number;
  provisioningState: string;
  health: 'healthy' | 'warning' | 'error';
}

export interface RegionAvailability {
  region: string;
  displayName: string;
  models: string[];
  totalDeployments: number;
  totalCapacity: number;
  utilizationPercent: number;
}
