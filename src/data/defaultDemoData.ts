export interface CustomerConfig {
  meta: {
    customerName: string;
    preparedBy?: string;
    preparedDate?: string;
    subscriptionIds?: string[];
    notes?: string;
  };
  quotas: QuotaEntry[];
  deployments: DeploymentEntry[];
  trends: TrendEntry[];
  regions: RegionEntry[];
}

export interface QuotaEntry {
  model: string;
  family: string;
  type: string;
  region: string;
  limit: number;
  used: number;
  unit: string;
}

export interface DeploymentEntry {
  name: string;
  account: string;
  model: string;
  version: string;
  sku: string;
  capacity: number;
  region: string;
  state: string;
  created: string;
}

export interface TrendEntry {
  date: string;
  models: Record<string, number>;
}

export interface RegionEntry {
  name: string;
  deployments: number;
  utilization: number;
}

export const DEFAULT_DEMO_DATA: CustomerConfig = {
  meta: {
    customerName: 'Demo Company',
    preparedBy: 'Azure AI Capacity Dashboard',
    preparedDate: new Date().toISOString().split('T')[0],
    notes: 'Default demo data — upload a customer JSON to replace',
  },
  quotas: [
    { model: 'gpt-4o', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 240000, used: 180000, unit: 'TPM' },
    { model: 'gpt-4o', family: 'GPT-4o', type: 'Global Standard', region: 'Global', limit: 600000, used: 150000, unit: 'TPM' },
    { model: 'gpt-4o-mini', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 300000, used: 95000, unit: 'TPM' },
    { model: 'gpt-4.1', family: 'GPT-4.1', type: 'Standard', region: 'Sweden Central', limit: 80000, used: 45000, unit: 'TPM' },
    { model: 'gpt-4.1-mini', family: 'GPT-4.1', type: 'Global Standard', region: 'Global', limit: 500000, used: 200000, unit: 'TPM' },
    { model: 'o3', family: 'o-series', type: 'Standard', region: 'East US 2', limit: 30000, used: 28000, unit: 'TPM' },
    { model: 'o4-mini', family: 'o-series', type: 'DataZone Standard', region: 'US DataZone', limit: 100000, used: 35000, unit: 'TPM' },
    { model: 'gpt-4-turbo', family: 'GPT-4', type: 'Standard', region: 'UK South', limit: 80000, used: 12000, unit: 'TPM' },
    { model: 'text-embedding-3-large', family: 'Embeddings', type: 'Standard', region: 'West US', limit: 1000000, used: 500000, unit: 'TPM' },
    { model: 'text-embedding-3-small', family: 'Embeddings', type: 'Global Standard', region: 'Global', limit: 2000000, used: 400000, unit: 'TPM' },
    { model: 'dall-e-3', family: 'DALL-E', type: 'Standard', region: 'East US', limit: 30, used: 8, unit: 'RPM' },
    { model: 'whisper', family: 'Whisper', type: 'Standard', region: 'North Central US', limit: 3, used: 1, unit: 'RPM' },
    { model: 'claude-4-sonnet', family: 'Anthropic Claude', type: 'Serverless', region: 'East US', limit: 100000, used: 60000, unit: 'TPM' },
    { model: 'llama-4-scout', family: 'Meta Llama', type: 'Serverless', region: 'West US 3', limit: 50000, used: 15000, unit: 'TPM' },
    { model: 'mistral-large', family: 'Mistral', type: 'Serverless', region: 'France Central', limit: 80000, used: 20000, unit: 'TPM' },
  ],
  deployments: [
    { name: 'gpt4o-prod', account: 'myoai-eastus', model: 'gpt-4o', version: '2024-11-20', sku: 'Standard', capacity: 120, region: 'East US', state: 'Succeeded', created: '2024-09-15' },
    { name: 'gpt4o-mini-prod', account: 'myoai-eastus', model: 'gpt-4o-mini', version: '2024-07-18', sku: 'Standard', capacity: 150, region: 'East US', state: 'Succeeded', created: '2024-08-20' },
    { name: 'gpt41-test', account: 'myoai-sweden', model: 'gpt-4.1', version: '2025-04-14', sku: 'Global Standard', capacity: 50, region: 'Sweden Central', state: 'Succeeded', created: '2025-04-16' },
    { name: 'o3-reasoning', account: 'myoai-eastus2', model: 'o3', version: '2025-04-16', sku: 'Standard', capacity: 30, region: 'East US 2', state: 'Succeeded', created: '2025-04-17' },
    { name: 'embed-large', account: 'myoai-westus', model: 'text-embedding-3-large', version: '1', sku: 'Standard', capacity: 500, region: 'West US', state: 'Succeeded', created: '2024-06-01' },
    { name: 'gpt4-turbo-legacy', account: 'myoai-uksouth', model: 'gpt-4-turbo', version: '2024-04-09', sku: 'Provisioned', capacity: 100, region: 'UK South', state: 'Succeeded', created: '2024-05-10' },
    { name: 'dalle3-images', account: 'myoai-eastus', model: 'dall-e-3', version: '3.0', sku: 'Standard', capacity: 6, region: 'East US', state: 'Succeeded', created: '2024-10-01' },
    { name: 'claude-sonnet-test', account: 'foundry-eastus', model: 'claude-4-sonnet', version: '20250414', sku: 'Serverless', capacity: 100, region: 'East US', state: 'Succeeded', created: '2025-04-15' },
    { name: 'gpt4o-staging', account: 'myoai-eastus', model: 'gpt-4o', version: '2024-11-20', sku: 'Standard', capacity: 40, region: 'East US', state: 'Creating', created: '2025-04-27' },
  ],
  trends: [
    { date: 'Mar 1', models: { 'GPT-4o': 120, 'GPT-4o-mini': 60, 'GPT-4.1': 0, 'o3': 10 } },
    { date: 'Mar 8', models: { 'GPT-4o': 135, 'GPT-4o-mini': 65, 'GPT-4.1': 0, 'o3': 12 } },
    { date: 'Mar 15', models: { 'GPT-4o': 142, 'GPT-4o-mini': 70, 'GPT-4.1': 0, 'o3': 15 } },
    { date: 'Mar 22', models: { 'GPT-4o': 150, 'GPT-4o-mini': 75, 'GPT-4.1': 10, 'o3': 18 } },
    { date: 'Mar 29', models: { 'GPT-4o': 160, 'GPT-4o-mini': 80, 'GPT-4.1': 20, 'o3': 20 } },
    { date: 'Apr 5', models: { 'GPT-4o': 165, 'GPT-4o-mini': 85, 'GPT-4.1': 30, 'o3': 22 } },
    { date: 'Apr 12', models: { 'GPT-4o': 170, 'GPT-4o-mini': 88, 'GPT-4.1': 38, 'o3': 25 } },
    { date: 'Apr 19', models: { 'GPT-4o': 175, 'GPT-4o-mini': 92, 'GPT-4.1': 42, 'o3': 27 } },
    { date: 'Apr 26', models: { 'GPT-4o': 180, 'GPT-4o-mini': 95, 'GPT-4.1': 45, 'o3': 28 } },
  ],
  regions: [
    { name: 'eastus', deployments: 5, utilization: 72 },
    { name: 'eastus2', deployments: 2, utilization: 93 },
    { name: 'westus', deployments: 2, utilization: 48 },
    { name: 'westus3', deployments: 1, utilization: 30 },
    { name: 'swedencentral', deployments: 2, utilization: 56 },
    { name: 'uksouth', deployments: 1, utilization: 15 },
    { name: 'francecentral', deployments: 1, utilization: 25 },
    { name: 'japaneast', deployments: 1, utilization: 40 },
  ],
};

export const CONTOSO_TEMPLATE: CustomerConfig = {
  meta: {
    customerName: 'Contoso',
    preparedBy: 'Your Name',
    preparedDate: new Date().toISOString().split('T')[0],
    subscriptionIds: ['00000000-0000-0000-0000-000000000001'],
    notes: 'Sample customer template — replace with real data',
  },
  quotas: [
    { model: 'gpt-4o', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 80000, used: 45000, unit: 'TPM' },
    { model: 'gpt-4o-mini', family: 'GPT-4o', type: 'Standard', region: 'East US', limit: 200000, used: 60000, unit: 'TPM' },
    { model: 'text-embedding-3-small', family: 'Embeddings', type: 'Standard', region: 'East US', limit: 350000, used: 120000, unit: 'TPM' },
  ],
  deployments: [
    { name: 'gpt4o-prod', account: 'contoso-oai-eastus', model: 'gpt-4o', version: '2024-11-20', sku: 'Standard', capacity: 80, region: 'East US', state: 'Succeeded', created: '2025-01-10' },
    { name: 'gpt4o-mini-chat', account: 'contoso-oai-eastus', model: 'gpt-4o-mini', version: '2024-07-18', sku: 'Standard', capacity: 200, region: 'East US', state: 'Succeeded', created: '2025-03-05' },
  ],
  trends: [],
  regions: [],
};
