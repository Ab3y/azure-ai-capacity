export interface ModelInfo {
  name: string;
  family: string;
  deploymentTypes: string[];
  description: string;
  docsUrl: string;
  maxTokens?: number;
  category: 'openai' | 'foundry' | 'ml';
}

export const MODEL_CATALOG: ModelInfo[] = [
  // Azure OpenAI models
  { name: 'gpt-4o', family: 'GPT-4o', deploymentTypes: ['Standard', 'Global Standard', 'Provisioned'], description: 'Most capable GPT-4o model for complex tasks', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#gpt-4o-and-gpt-4o-mini', maxTokens: 128000, category: 'openai' },
  { name: 'gpt-4o-mini', family: 'GPT-4o', deploymentTypes: ['Standard', 'Global Standard'], description: 'Smaller, faster, cheaper GPT-4o variant', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#gpt-4o-and-gpt-4o-mini', maxTokens: 128000, category: 'openai' },
  { name: 'gpt-4.1', family: 'GPT-4.1', deploymentTypes: ['Standard', 'Global Standard'], description: 'Latest GPT-4.1 model with improved coding and instruction following', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models', maxTokens: 1047576, category: 'openai' },
  { name: 'gpt-4.1-mini', family: 'GPT-4.1', deploymentTypes: ['Standard', 'Global Standard'], description: 'Efficient GPT-4.1 variant balancing performance and cost', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models', maxTokens: 1047576, category: 'openai' },
  { name: 'gpt-4.1-nano', family: 'GPT-4.1', deploymentTypes: ['Standard', 'Global Standard'], description: 'Fastest and most cost-effective GPT-4.1 variant', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models', maxTokens: 1047576, category: 'openai' },
  { name: 'o3', family: 'o-series', deploymentTypes: ['Standard', 'Global Standard', 'DataZone Standard'], description: 'Advanced reasoning model for complex multi-step tasks', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#o-series-models', maxTokens: 200000, category: 'openai' },
  { name: 'o4-mini', family: 'o-series', deploymentTypes: ['Standard', 'Global Standard', 'DataZone Standard'], description: 'Efficient reasoning model optimized for STEM tasks', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#o-series-models', maxTokens: 200000, category: 'openai' },
  { name: 'gpt-4', family: 'GPT-4', deploymentTypes: ['Standard', 'Provisioned'], description: 'High-capability model for complex tasks', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#gpt-4', maxTokens: 8192, category: 'openai' },
  { name: 'gpt-4-turbo', family: 'GPT-4', deploymentTypes: ['Standard', 'Provisioned'], description: 'GPT-4 Turbo with vision capabilities', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#gpt-4-turbo', maxTokens: 128000, category: 'openai' },
  { name: 'dall-e-3', family: 'DALL-E', deploymentTypes: ['Standard'], description: 'Image generation from text descriptions', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#dall-e', category: 'openai' },
  { name: 'whisper', family: 'Whisper', deploymentTypes: ['Standard'], description: 'Speech-to-text transcription model', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#whisper', category: 'openai' },
  { name: 'text-embedding-ada-002', family: 'Embeddings', deploymentTypes: ['Standard'], description: 'Text embedding model for search and similarity', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#embeddings', category: 'openai' },
  { name: 'text-embedding-3-small', family: 'Embeddings', deploymentTypes: ['Standard', 'Global Standard'], description: 'Small, efficient text embedding model', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#embeddings', category: 'openai' },
  { name: 'text-embedding-3-large', family: 'Embeddings', deploymentTypes: ['Standard', 'Global Standard'], description: 'High-performance text embedding model', docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models#embeddings', category: 'openai' },
  // Azure AI Foundry third-party models
  { name: 'claude-4-sonnet', family: 'Anthropic Claude', deploymentTypes: ['Serverless'], description: 'Anthropic Claude 4 Sonnet — balanced performance and speed', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-anthropic', category: 'foundry' },
  { name: 'claude-4-opus', family: 'Anthropic Claude', deploymentTypes: ['Serverless'], description: 'Anthropic Claude 4 Opus — highest capability model', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-anthropic', category: 'foundry' },
  { name: 'claude-3.5-haiku', family: 'Anthropic Claude', deploymentTypes: ['Serverless'], description: 'Anthropic Claude 3.5 Haiku — fast and efficient', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-anthropic', category: 'foundry' },
  { name: 'llama-4-scout', family: 'Meta Llama', deploymentTypes: ['Serverless', 'Managed Compute'], description: 'Meta Llama 4 Scout — mixture-of-experts architecture', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-llama', category: 'foundry' },
  { name: 'llama-4-maverick', family: 'Meta Llama', deploymentTypes: ['Serverless', 'Managed Compute'], description: 'Meta Llama 4 Maverick — large scale MoE model', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-llama', category: 'foundry' },
  { name: 'mistral-large', family: 'Mistral', deploymentTypes: ['Serverless'], description: 'Mistral Large — flagship multilingual model', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-mistral', category: 'foundry' },
  { name: 'deepseek-r1', family: 'DeepSeek', deploymentTypes: ['Serverless'], description: 'DeepSeek R1 — advanced reasoning model', docsUrl: 'https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-deepseek', category: 'foundry' },
];

export const MODEL_FAMILIES = [...new Set(MODEL_CATALOG.map(m => m.family))];
export const DEPLOYMENT_TYPES = ['Standard', 'Global Standard', 'Provisioned', 'DataZone Standard', 'Serverless', 'Managed Compute'];
