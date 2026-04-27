export interface BestPractice {
  id: string;
  title: string;
  category: string;
  summary: string;
  details: string;
  docsUrl: string;
  icon: string;
}

export const BEST_PRACTICES: BestPractice[] = [
  {
    id: 'quota-monitoring',
    title: 'Proactive Quota Monitoring',
    category: 'Capacity Management',
    summary: 'Monitor quota usage proactively to avoid service disruptions.',
    details: 'Set up alerts at 50%, 75%, and 90% utilization thresholds. Use Azure Monitor or this dashboard to track usage trends and plan capacity increases before hitting limits.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
    icon: 'gauge',
  },
  {
    id: 'deployment-types',
    title: 'Choose the Right Deployment Type',
    category: 'Deployment Strategy',
    summary: 'Standard vs Global Standard vs Provisioned Throughput — pick the right fit.',
    details: 'Use Standard for development and variable workloads. Use Global Standard for higher default quotas with variable latency. Use Provisioned Throughput (PTU) for production workloads requiring predictable latency and guaranteed throughput.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types',
    icon: 'rocket',
  },
  {
    id: 'rate-limits',
    title: 'Implement Retry Logic for Rate Limits',
    category: 'Reliability',
    summary: 'Handle 429 errors gracefully with exponential backoff.',
    details: 'Azure OpenAI enforces TPM (Tokens Per Minute) and RPM (Requests Per Minute) limits. Implement exponential backoff with jitter. Use the Retry-After header. Consider using Azure API Management as a gateway for built-in rate limiting and load balancing.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#understanding-rate-limits',
    icon: 'repeat',
  },
  {
    id: 'multi-region',
    title: 'Multi-Region Deployment Strategy',
    category: 'Reliability',
    summary: 'Distribute workloads across regions for resilience and capacity.',
    details: 'Deploy models in multiple regions for disaster recovery and to access higher aggregate quotas. Use Azure Front Door or APIM for intelligent traffic routing. Monitor per-region utilization to balance load.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/business-continuity-disaster-recovery',
    icon: 'globe',
  },
  {
    id: 'ptu-planning',
    title: 'Plan Provisioned Throughput (PTU) Capacity',
    category: 'Cost Optimization',
    summary: 'Right-size PTU reservations based on actual usage patterns.',
    details: 'Analyze your peak and average usage to determine PTU requirements. Start with Standard deployments to establish baselines, then migrate to PTU for predictable workloads. PTU is billed hourly regardless of usage — ensure utilization stays above 60% to be cost-effective vs Standard.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput',
    icon: 'zap',
  },
  {
    id: 'content-filtering',
    title: 'Understand Content Filtering Impact',
    category: 'Security',
    summary: 'Content filters consume tokens and affect effective throughput.',
    details: 'Default content filters are applied to all deployments. Custom content filter configurations can be created for specific use cases. Be aware that content filtering adds latency and consumes tokens from your quota.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/content-filter',
    icon: 'shield',
  },
  {
    id: 'model-lifecycle',
    title: 'Track Model Retirements and Upgrades',
    category: 'Operations',
    summary: 'Stay ahead of model deprecation and version changes.',
    details: 'Azure OpenAI models have defined lifecycle stages. Monitor upcoming retirements and plan migrations. Use auto-upgrade policies where available. Test new model versions before switching production workloads.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/model-retirements',
    icon: 'calendar',
  },
  {
    id: 'apim-gateway',
    title: 'Use APIM as an AI Gateway',
    category: 'Architecture',
    summary: 'Centralize AI API management with Azure API Management.',
    details: 'APIM provides load balancing across multiple Azure OpenAI backends, semantic caching to reduce costs, token-based rate limiting, content safety policies, and centralized monitoring. Essential for production AI applications.',
    docsUrl: 'https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities',
    icon: 'network',
  },
  {
    id: 'cost-optimization',
    title: 'Optimize Token Costs',
    category: 'Cost Optimization',
    summary: 'Choose the right model size and optimize prompts to reduce costs.',
    details: 'Use smaller models (GPT-4o-mini, GPT-4.1-nano) for simpler tasks. Optimize prompts to reduce input tokens. Use structured outputs to control response length. Batch API for non-real-time workloads offers 50% discount.',
    docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#pricing',
    icon: 'coins',
  },
  {
    id: 'waf-ai',
    title: 'Follow Well-Architected Framework for AI',
    category: 'Architecture',
    summary: 'Apply WAF pillars to your AI workloads.',
    details: 'The Azure Well-Architected Framework provides guidance across reliability, security, cost optimization, operational excellence, and performance efficiency specifically for Azure OpenAI workloads.',
    docsUrl: 'https://learn.microsoft.com/azure/well-architected/service-guides/azure-openai',
    icon: 'building',
  },
];

export const PRACTICE_CATEGORIES = [...new Set(BEST_PRACTICES.map(bp => bp.category))];
