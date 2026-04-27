import type { TooltipData } from '@/types/app';

export const TOOLTIPS: Record<string, TooltipData> = {
  tpm: {
    title: 'Tokens Per Minute (TPM)',
    description: 'The maximum number of tokens your deployment can process per minute. This limit is shared across all requests to the same deployment.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
    bestPractice: 'Monitor TPM usage and set alerts at 75% to avoid throttling.',
  },
  rpm: {
    title: 'Requests Per Minute (RPM)',
    description: 'The maximum number of API requests allowed per minute. Each API call counts as one request regardless of token count.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#understanding-rate-limits',
    bestPractice: 'Implement retry-after headers and exponential backoff for 429 responses.',
  },
  ptu: {
    title: 'Provisioned Throughput Units (PTU)',
    description: 'Reserved capacity that provides predictable latency and throughput. Each PTU provides a fixed amount of processing capacity measured in tokens per minute.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput',
    bestPractice: 'Use PTU for production workloads with consistent demand. Ensure >60% utilization for cost-effectiveness.',
  },
  globalStandard: {
    title: 'Global Standard Deployment',
    description: 'Routes traffic dynamically across Azure\'s global infrastructure. Provides higher default quotas but with variable latency depending on routing.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types',
    bestPractice: 'Ideal for development/testing and workloads that can tolerate variable latency.',
  },
  standard: {
    title: 'Standard Deployment',
    description: 'Deployed to a specific Azure region. Pay-per-token pricing with defined rate limits based on your quota.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types',
    bestPractice: 'Best for production workloads needing regional data residency with predictable latency.',
  },
  dataZone: {
    title: 'DataZone Standard Deployment',
    description: 'Routes traffic within a defined geographic data zone (e.g., US, EU). Balances data residency requirements with higher availability.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types',
    bestPractice: 'Use when you need geographic data residency compliance with flexible routing.',
  },
  quotaLimit: {
    title: 'Quota Limit',
    description: 'The maximum capacity allocated to your subscription for a specific model and deployment type in a given region.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
    bestPractice: 'Request quota increases through the Azure Portal before you reach limits.',
  },
  utilization: {
    title: 'Utilization Percentage',
    description: 'The percentage of your allocated quota currently in use. Calculated as (current usage / quota limit) × 100.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
    bestPractice: 'Keep utilization below 80% to allow for traffic spikes. Set alerts at 75%.',
  },
  provisioningState: {
    title: 'Provisioning State',
    description: 'The current lifecycle state of a deployment: Succeeded (ready), Creating (deploying), Failed (error), or Deleting (removing).',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource',
  },
  contentFilter: {
    title: 'Content Filter',
    description: 'Azure AI Content Safety filters applied to inputs and outputs. Default filters block harmful content across hate, violence, sexual, and self-harm categories.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/content-filter',
    bestPractice: 'Review default filter settings and create custom configurations if needed for your use case.',
  },
};
