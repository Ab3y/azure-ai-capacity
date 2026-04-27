import { useState } from 'react';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  Globe, 
  Headphones, 
  Trash2, 
  Minimize2, 
  Layers, 
  Sparkles,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepProps {
  number: number;
  title: string;
  description: string;
  details: string;
  docsUrl: string;
  icon: React.ReactNode;
  cliCommand?: string;
  portalLink?: string;
  important?: boolean;
}

function Step({ number, title, description, details, docsUrl, icon, cliCommand, portalLink, important }: StepProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      'border rounded-xl overflow-hidden transition-shadow',
      important 
        ? 'border-[hsl(var(--primary)/0.5)] bg-[hsl(var(--primary)/0.03)]'
        : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]',
      expanded && 'shadow-md'
    )}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-[hsl(var(--muted)/0.3)] transition-colors"
      >
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
          important
            ? 'bg-[hsl(var(--primary))] text-white'
            : 'bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]'
        )}>
          {number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[hsl(var(--primary))]">{icon}</span>
            <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm">{title}</h4>
            {important && (
              <span className="text-xs bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] px-2 py-0.5 rounded-full font-medium">
                Recommended
              </span>
            )}
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{description}</p>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" /> : <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))] shrink-0" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0 ml-12 space-y-3">
          <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed">{details}</p>

          {cliCommand && (
            <div className="relative">
              <div className="flex items-center gap-2 mb-1">
                <Terminal className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-xs font-medium text-[hsl(var(--muted-foreground))]">Azure CLI Command</span>
              </div>
              <div className="bg-[hsl(var(--foreground)/0.05)] dark:bg-[hsl(var(--background))] rounded-lg p-3 font-mono text-xs text-[hsl(var(--foreground))] overflow-x-auto">
                <code>{cliCommand}</code>
                <button
                  onClick={(e) => { e.stopPropagation(); handleCopy(cliCommand); }}
                  className="absolute top-8 right-2 p-1.5 rounded-md hover:bg-[hsl(var(--muted))] transition-colors"
                  title="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <a
              href={docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-1.5 rounded-lg"
            >
              📖 Microsoft Learn Docs <ExternalLink className="w-3 h-3" />
            </a>
            {portalLink && (
              <a
                href={portalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[hsl(var(--primary))] hover:opacity-90 px-3 py-1.5 rounded-lg transition-opacity"
              >
                🌐 Open in Azure Portal <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type TabType = 'increase' | 'decrease';

export function QuotaChangeGuide() {
  const [activeTab, setActiveTab] = useState<TabType>('increase');

  const increaseSteps: StepProps[] = [
    {
      number: 1,
      title: 'Identify the Quota to Change',
      description: 'Determine which model, deployment type, and region need more capacity.',
      details: 'Use the Quota Table in this dashboard to identify quotas that are at or approaching their limits. Note the model name, deployment type (Standard, Global Standard, Provisioned), and region — you will need these when requesting an increase.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      number: 2,
      title: 'Self-Service Increase via Azure Portal',
      description: 'Most Standard quota increases are auto-approved within minutes.',
      details: 'Navigate to Azure Portal → search "Quotas" → My Quotas → select "Microsoft.CognitiveServices" provider. Find your model/region combination, click the pencil icon or "Request increase", and enter the desired new limit. Standard deployment quota increases within default limits are typically auto-approved.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota',
      icon: <Globe className="w-4 h-4" />,
      portalLink: 'https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas',
      important: true,
    },
    {
      number: 3,
      title: 'Programmatic Request via Azure CLI',
      description: 'Automate quota changes with Azure CLI for CI/CD and IaC workflows.',
      details: 'Use the Azure CLI to modify deployment capacity or request quota changes programmatically. This is useful for infrastructure-as-code workflows, batch updates across subscriptions, or automated scaling scripts.',
      docsUrl: 'https://learn.microsoft.com/cli/azure/cognitiveservices/account/deployment',
      icon: <Terminal className="w-4 h-4" />,
      cliCommand: 'az cognitiveservices account deployment create \\\n  --name <account-name> \\\n  --resource-group <rg-name> \\\n  --deployment-name <deployment-name> \\\n  --model-name gpt-4o \\\n  --model-version "2024-11-20" \\\n  --model-format OpenAI \\\n  --sku-capacity 120 \\\n  --sku-name "Standard"',
    },
    {
      number: 4,
      title: 'Provisioned Throughput (PTU) Requests',
      description: 'PTU capacity requires a separate onboarding process with commitment.',
      details: 'Provisioned Throughput Units (PTU) provide guaranteed, reserved capacity with predictable latency. PTU requires a minimum commitment period and is allocated per-region. Submit a request through the Azure Portal PTU onboarding form, or work with your Microsoft account team for enterprise-scale PTU deployments.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput',
      icon: <Sparkles className="w-4 h-4" />,
      portalLink: 'https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas',
    },
    {
      number: 5,
      title: 'File an Azure Support Ticket',
      description: 'For increases beyond self-service limits or special requirements.',
      details: 'If self-service quota increases are insufficient, file an Azure Support request: Azure Portal → Help + Support → New Support Request → Service: Cognitive Services → Problem type: Azure OpenAI → Problem subtype: Quota or Capacity. Include your subscription ID, desired model, region, target limit, expected usage timeline, and business justification.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/quotas-limits',
      icon: <Headphones className="w-4 h-4" />,
      portalLink: 'https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest',
    },
    {
      number: 6,
      title: 'Consider Global Standard or DataZone Deployments',
      description: 'Higher default quotas with flexible regional routing.',
      details: 'If you are consistently hitting Standard regional quota limits, consider switching to Global Standard (routes across all Azure regions globally) or DataZone Standard (routes within a geographic zone like US or EU). These deployment types offer significantly higher default quotas. Trade-off: variable latency since requests may be routed to different regions.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types',
      icon: <Globe className="w-4 h-4" />,
    },
  ];

  const decreaseSteps: StepProps[] = [
    {
      number: 1,
      title: 'Delete Unused Deployments',
      description: 'Deployed capacity counts against quota even when idle.',
      details: 'Review all deployments in this dashboard\'s Deployments page. Any deployment with consistently low or zero utilization is consuming quota unnecessarily. Delete unused deployments via Azure Portal or CLI. The freed quota becomes immediately available for other deployments.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource',
      icon: <Trash2 className="w-4 h-4" />,
      cliCommand: 'az cognitiveservices account deployment delete \\\n  --name <account-name> \\\n  --resource-group <rg-name> \\\n  --deployment-name <deployment-name>',
      important: true,
    },
    {
      number: 2,
      title: 'Scale Down Deployment Capacity',
      description: 'Reduce the TPM allocation on over-provisioned deployments.',
      details: 'If a deployment is allocated more TPM than it uses, reduce its capacity. For example, if you allocated 120K TPM but peak usage is only 40K, scale down to 60K (leaving headroom for spikes). This frees quota for use by other deployments or models.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#assign-quota',
      icon: <Minimize2 className="w-4 h-4" />,
      cliCommand: 'az cognitiveservices account deployment create \\\n  --name <account-name> \\\n  --resource-group <rg-name> \\\n  --deployment-name <deployment-name> \\\n  --model-name gpt-4o \\\n  --model-version "2024-11-20" \\\n  --model-format OpenAI \\\n  --sku-capacity 60 \\\n  --sku-name "Standard"',
    },
    {
      number: 3,
      title: 'Downsize PTU Reservations',
      description: 'Adjust PTU commitments at renewal to avoid paying for unused capacity.',
      details: 'PTU reservations have commitment periods. Before your current commitment expires, evaluate actual PTU utilization using this dashboard. If utilization is consistently below 60%, consider downsizing at renewal. Work with your Microsoft account team to adjust PTU commitments.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput',
      icon: <ArrowDownCircle className="w-4 h-4" />,
    },
    {
      number: 4,
      title: 'Consolidate to Fewer Regions',
      description: 'Simplify management and potentially access higher per-region limits.',
      details: 'If deployments are spread thinly across many regions with low utilization in each, consolidate to fewer regions. This simplifies management and may give you access to higher aggregate capacity in those regions. Use the Regions page to identify consolidation opportunities.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/how-to/business-continuity-disaster-recovery',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      number: 5,
      title: 'Migrate to Smaller or Newer Models',
      description: 'Use efficient models where full capability is not required.',
      details: 'Evaluate whether workloads on expensive, high-capacity models can run on smaller models. For example: migrate simple classification tasks from GPT-4o to GPT-4o-mini (uses less quota per request), move embedding workloads to text-embedding-3-small, or test newer models like GPT-4.1-nano which may offer better efficiency. Each model tier uses different quota pools.',
      docsUrl: 'https://learn.microsoft.com/azure/ai-services/openai/concepts/models',
      icon: <Sparkles className="w-4 h-4" />,
    },
  ];

  const steps = activeTab === 'increase' ? increaseSteps : decreaseSteps;

  return (
    <div className="space-y-6">
      {/* Quick Context Banner */}
      <div className="bg-[hsl(var(--primary)/0.05)] border border-[hsl(var(--primary)/0.2)] rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[hsl(var(--primary))] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm">
              Why Manage Capacity?
            </h4>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
              Azure AI services enforce quota limits per subscription, model, deployment type, and region. 
              Managing capacity proactively prevents service disruptions (429 rate limit errors) and avoids paying 
              for unused reserved capacity. Use this guide to walk through the official steps.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('increase')}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all',
            activeTab === 'increase'
              ? 'bg-green-500/10 text-green-700 dark:text-green-400 border-2 border-green-500/40 shadow-sm'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-2 border-transparent hover:text-[hsl(var(--foreground))]'
          )}
        >
          <ArrowUpCircle className="w-5 h-5" />
          Increase Capacity
        </button>
        <button
          onClick={() => setActiveTab('decrease')}
          className={cn(
            'flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all',
            activeTab === 'decrease'
              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-2 border-blue-500/40 shadow-sm'
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-2 border-transparent hover:text-[hsl(var(--foreground))]'
          )}
        >
          <ArrowDownCircle className="w-5 h-5" />
          Decrease Capacity
        </button>
      </div>

      {/* Summary */}
      <div className="text-sm text-[hsl(var(--muted-foreground))]">
        {activeTab === 'increase'
          ? 'Follow these steps to request additional Azure AI capacity. Start with self-service in the Azure Portal — most increases are auto-approved.'
          : 'Follow these steps to release unused capacity, reduce costs, and free up quota for other deployments.'}
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <Step key={step.number} {...step} />
        ))}
      </div>

      {/* Footer CTA */}
      <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm">Need Help?</h4>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            For complex capacity planning or enterprise-scale requests, contact your Microsoft account team or file a support ticket.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="https://learn.microsoft.com/azure/ai-services/openai/quotas-limits"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-2 rounded-lg"
          >
            View All Limits <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-[hsl(var(--primary))] hover:opacity-90 px-3 py-2 rounded-lg transition-opacity"
          >
            File Support Ticket <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
