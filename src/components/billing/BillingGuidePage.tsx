import { useState } from 'react';
import { 
  DollarSign, ChevronDown, ChevronRight, ExternalLink, BookOpen,
  Coins, HelpCircle, Database, Code, BarChart3, Lightbulb, 
  Building, Users, CheckSquare, Zap, AlertTriangle, ArrowRight,
  Shield, TrendingDown, Layers, Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Collapsible Section component
function Section({ id, title, icon: Icon, children, defaultOpen = false }: {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="scroll-mt-20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 py-4 text-left group"
      >
        <div className="p-2 rounded-lg bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold text-[hsl(var(--foreground))] flex-1">{title}</h2>
        {open ? <ChevronDown className="w-5 h-5 text-[hsl(var(--muted-foreground))]" /> : <ChevronRight className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />}
      </button>
      {open && <div className="pb-6 space-y-4">{children}</div>}
    </div>
  );
}

// Styled table
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto border border-[hsl(var(--border))] rounded-lg">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[hsl(var(--muted)/0.5)]">
            {headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2.5 font-semibold text-[hsl(var(--foreground))] border-b border-[hsl(var(--border))]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[hsl(var(--border))] last:border-0 hover:bg-[hsl(var(--muted)/0.3)]">
              {row.map((cell, j) => (
                <td key={j} className={cn("px-4 py-2.5 text-[hsl(var(--muted-foreground))]", j === 0 && "font-medium text-[hsl(var(--foreground))]")} dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// FAQ item
function FAQ({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[hsl(var(--muted)/0.3)]">
        <HelpCircle className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
        <span className="text-sm font-medium text-[hsl(var(--foreground))] flex-1">{question}</span>
        {open ? <ChevronDown className="w-4 h-4 text-[hsl(var(--muted-foreground))]" /> : <ChevronRight className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />}
      </button>
      {open && <div className="px-4 pb-3 text-sm text-[hsl(var(--muted-foreground))] border-t border-[hsl(var(--border))] pt-3" dangerouslySetInnerHTML={{ __html: answer }} />}
    </div>
  );
}

// Info callout
function Callout({ type, children }: { type: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-800 dark:text-yellow-300',
    tip: 'bg-green-500/10 border-green-500/30 text-green-800 dark:text-green-300',
  };
  const icons = { info: Zap, warning: AlertTriangle, tip: Lightbulb };
  const Icon = icons[type];
  return (
    <div className={cn("border rounded-lg p-3 flex items-start gap-2 text-sm", styles[type])}>
      <Icon className="w-4 h-4 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}

// Code block
function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="bg-[hsl(var(--foreground)/0.05)] dark:bg-[hsl(var(--background))] rounded-lg overflow-hidden border border-[hsl(var(--border))]">
      {title && <div className="px-4 py-2 text-xs font-medium text-[hsl(var(--muted-foreground))] border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">{title}</div>}
      <pre className="p-4 text-xs text-[hsl(var(--foreground))] overflow-x-auto font-mono leading-relaxed">{code}</pre>
    </div>
  );
}

// Table of contents
const TOC = [
  { id: 'executive-summary', label: 'Executive Summary' },
  { id: 'billing-concepts', label: 'Core Billing Concepts' },
  { id: 'faq', label: 'Customer FAQ' },
  { id: 'billing-data', label: 'Where Billing Data Lives' },
  { id: 'api-access', label: 'Programmatic Access' },
  { id: 'observability', label: 'Observability & Dashboards' },
  { id: 'cost-optimization', label: 'Cost Optimization' },
  { id: 'enterprise', label: 'Enterprise Best Practices' },
  { id: 'case-study', label: 'Customer Case Study' },
  { id: 'cheat-sheet', label: 'Quick Reference' },
];

export function BillingGuidePage() {
  return (
    <div className="flex gap-6">
      {/* Table of Contents - sticky sidebar */}
      <nav className="hidden xl:block w-48 shrink-0">
        <div className="sticky top-4 space-y-1">
          <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-2">On this page</p>
          {TOC.map(item => (
            <a key={item.id} href={`#${item.id}`} className="block text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] py-1 transition-colors">
              {item.label}
            </a>
          ))}
          <div className="border-t border-[hsl(var(--border))] pt-2 mt-3">
            <a href="https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline">
              Azure Pricing <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-[hsl(var(--primary))]" />
            Billing & Cost Management Guide
          </h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Enterprise reference for understanding, monitoring, and optimizing Azure OpenAI costs
          </p>
        </div>

        {/* 1. Executive Summary */}
        <Section id="executive-summary" title="Executive Summary" icon={BookOpen} defaultOpen={true}>
          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
            Azure OpenAI billing is based on <strong className="text-[hsl(var(--foreground))]">token consumption</strong> and/or <strong className="text-[hsl(var(--foreground))]">provisioned capacity (PTU)</strong>. Understanding how billing works at the model level is critical for enterprise customers who need cost predictability, governance, and optimization.
          </p>
          <Table
            headers={['Concept', 'Description']}
            rows={[
              ['<strong>Token</strong>', 'The fundamental billing unit. Both input (prompt) and output (completion) tokens are counted and billed.'],
              ['<strong>PTU</strong>', 'Provisioned Throughput Unit — reserved capacity billed hourly regardless of usage. Guaranteed throughput and latency.'],
              ['<strong>PAYG</strong>', 'Pay-As-You-Go — consumption-based billing per 1,000 tokens processed. No commitment.'],
              ['<strong>Model-Level Billing</strong>', 'Different models have different per-token prices. GPT-4o costs more than GPT-4o-mini per token.'],
              ['<strong>Deployment</strong>', 'Each model deployment has its own capacity allocation and usage tracking.'],
            ]}
          />
          <Callout type="info">
            <strong>Why this matters:</strong> The difference between PTU and PAYG can represent 30-60% cost savings at scale. Regulated industries need clear cost attribution and audit trails.
          </Callout>
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 2. Core Billing Concepts */}
        <Section id="billing-concepts" title="Core Billing Concepts" icon={Coins}>
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Tokens — The Fundamental Unit</h3>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Every API call processes <strong className="text-[hsl(var(--foreground))]">tokens</strong> — fragments of text (~4 characters or ~0.75 words). Both input and output tokens are billed separately, with output tokens typically costing more.
          </p>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Model Pricing Comparison</h3>
          <Table
            headers={['Model', 'Input (per 1M tokens)', 'Output (per 1M tokens)', 'Best For']}
            rows={[
              ['GPT-4o', '$2.50', '$10.00', 'Complex reasoning, analysis'],
              ['GPT-4o-mini', '$0.15', '$0.60', 'Simple tasks, classification'],
              ['GPT-4.1', '$2.00', '$8.00', 'Coding, instruction following'],
              ['GPT-4.1-mini', '$0.40', '$1.60', 'Balanced performance/cost'],
              ['GPT-4.1-nano', '$0.10', '$0.40', 'High-volume simple tasks'],
              ['o3', '$10.00', '$40.00', 'Advanced multi-step reasoning'],
              ['o4-mini', '$1.10', '$4.40', 'Efficient reasoning'],
              ['text-embedding-3-small', '$0.02', 'N/A', 'Search embeddings'],
            ]}
          />

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">PTU vs PAYG — Detailed Comparison</h3>
          <Table
            headers={['Dimension', 'PTU (Provisioned)', 'PAYG (Pay-As-You-Go)']}
            rows={[
              ['Billing Model', 'Hourly rate per PTU reserved', 'Per 1,000 tokens consumed'],
              ['Cost Predictability', '✅ Fixed monthly cost', '❌ Variable, usage-dependent'],
              ['Latency', '✅ Guaranteed low latency', '⚠️ Variable, may spike under load'],
              ['Throughput', '✅ Guaranteed TPM', '⚠️ Subject to rate limits'],
              ['Commitment', 'Monthly or annual reservation', 'No commitment'],
              ['Idle Cost', '❌ Pays even when idle', '✅ No cost when idle'],
              ['Best For', 'Production with consistent traffic', 'Dev/test, bursty workloads'],
              ['Cost at Scale', '30-60% cheaper at high utilization', 'More expensive at sustained usage'],
            ]}
          />

          <Callout type="tip">
            <strong>Hybrid approach (recommended):</strong> Use PTU for baseline production workload (predictable 60-80%), PAYG for overflow/burst. Route via Azure API Management to prioritize PTU.
          </Callout>
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 3. FAQ */}
        <Section id="faq" title="What Customers Typically Ask" icon={HelpCircle}>
          <div className="space-y-2">
            <FAQ
              question="Can I see cost per model on my invoice?"
              answer="<strong>Yes, partially.</strong> Azure Cost Management shows costs at the <em>resource level</em>. If you deploy different models to separate resources, you get model-level visibility. <strong>Recommendation:</strong> Deploy each model family to a separate Azure OpenAI resource for clean billing segmentation."
            />
            <FAQ
              question="How do I track token usage per model?"
              answer="Token usage is available via: <br/>1. <strong>Azure Portal</strong> → OpenAI resource → Metrics → 'Processed Inference Tokens' (filterable by deployment)<br/>2. <strong>API response headers</strong> — every response includes <code>usage.prompt_tokens</code> and <code>usage.completion_tokens</code><br/>3. <strong>Azure Monitor / Log Analytics</strong> — if diagnostic logging is enabled<br/>4. <strong>Cost Management APIs</strong> — aggregated consumption data"
            />
            <FAQ
              question="How do PTUs affect my billing?"
              answer="PTUs are billed <strong>hourly at a fixed rate regardless of usage</strong>. If you reserve 100 PTUs but only use 30%, you still pay for 100 PTUs. PTU billing appears as a separate line item from PAYG consumption."
            />
            <FAQ
              question="Why does my AI bill fluctuate month to month?"
              answer="Common causes:<br/>• <strong>PAYG usage variance</strong> — more API calls = higher costs<br/>• <strong>Model changes</strong> — switching from GPT-4o-mini to GPT-4o increases per-token cost ~17x<br/>• <strong>Prompt engineering changes</strong> — longer prompts = more input tokens<br/>• <strong>Context window growth</strong> — RAG apps adding more context documents<br/>• <strong>New deployments</strong> — teams spinning up models without cost awareness"
            />
            <FAQ
              question="Where can I see billing data in Azure Portal?"
              answer="<strong>Cost Management + Billing</strong> → Cost Analysis → Filter by resource type 'Microsoft.CognitiveServices'<br/><strong>OpenAI Resource</strong> → Metrics blade → 'Processed Inference Tokens' metric<br/><strong>OpenAI Resource</strong> → Deployments → Each deployment shows capacity and usage"
            />
          </div>
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 4. Where Billing Data Lives */}
        <Section id="billing-data" title="Where Billing Data Lives in Azure" icon={Database}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2">✅ What You CAN See</h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>• Total cost by resource, resource group, subscription</li>
                <li>• Daily/weekly/monthly cost trends</li>
                <li>• Cost by meter (token type, PTU hours)</li>
                <li>• Token usage per deployment (Metrics blade)</li>
                <li>• Budget alerts and forecasts</li>
              </ul>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2">❌ Limitations</h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>• No per-deployment cost breakdown (only per-resource)</li>
                <li>• 24-48 hour data delay in Cost Management</li>
                <li>• Limited token-level granularity in billing</li>
                <li>• Cannot correlate cost with specific API calls</li>
                <li>• No multi-resource aggregation in native view</li>
              </ul>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Required RBAC Roles</h3>
          <Table
            headers={['Role', 'What They Can See']}
            rows={[
              ['Billing Reader', 'Cost data across subscriptions'],
              ['Cost Management Reader', 'Cost analysis, budgets, exports'],
              ['Cognitive Services User', 'Usage metrics for specific resources'],
              ['Monitoring Reader', 'Metrics and diagnostic logs'],
            ]}
          />
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 5. API Access */}
        <Section id="api-access" title="Programmatic Access (APIs)" icon={Code}>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">Retrieve billing and usage data programmatically for custom dashboards and automation:</p>

          <CodeBlock title="Cost Management API — Query costs by resource" code={`POST /subscriptions/{subId}/providers/Microsoft.CostManagement/query
     ?api-version=2023-11-01

{
  "type": "ActualCost",
  "timeframe": "MonthToDate",
  "dataset": {
    "granularity": "Daily",
    "aggregation": {
      "totalCost": { "name": "Cost", "function": "Sum" }
    },
    "filter": {
      "dimensions": {
        "name": "ResourceType",
        "operator": "In",
        "values": ["microsoft.cognitiveservices/accounts"]
      }
    },
    "grouping": [
      { "type": "Dimension", "name": "ResourceId" }
    ]
  }
}`} />

          <CodeBlock title="Azure Monitor Metrics API — Token usage per deployment" code={`GET /subscriptions/{subId}/resourceGroups/{rg}
    /providers/Microsoft.CognitiveServices/accounts/{account}
    /providers/Microsoft.Insights/metrics
    ?api-version=2024-02-01
    &metricnames=ProcessedInferenceTokens
    &timespan=2026-04-01/2026-04-29
    &interval=P1D
    &aggregation=Total
    &$filter=Deployment eq 'gpt4o-prod'`} />

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Data Pipeline Pattern</h3>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4 font-mono text-xs text-[hsl(var(--foreground))]">
            <div className="flex flex-col gap-1">
              <span>Cost Management API ──→ Azure Function (scheduled) ──┐</span>
              <span>Monitor Metrics API ──→ Azure Function (scheduled) ──┤</span>
              <span>{"                                                     ├──→ Data Store (ADX / ADLS)"}</span>
              <span>{"                                                     │         │"}</span>
              <span>{"                                                     │    Grafana / Power BI"}</span>
            </div>
          </div>
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 6. Observability */}
        <Section id="observability" title="Observability & Dashboard Architecture" icon={Monitor}>
          <Callout type="warning">
            Azure's native billing views have significant limitations — 24-48 hour delays, no per-deployment costs, limited alerting. <strong>Enterprise customers need custom dashboards</strong> for real-time visibility.
          </Callout>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Reference Architecture</h3>
          <div className="bg-[hsl(var(--muted)/0.3)] border border-[hsl(var(--border))] rounded-xl p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <p className="font-semibold text-blue-700 dark:text-blue-300">Azure OpenAI</p>
                <p className="text-blue-600/70 dark:text-blue-400/70 mt-1">Resources &<br/>Deployments</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 flex flex-col justify-center">
                <Code className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <p className="font-semibold text-purple-700 dark:text-purple-300">Azure Functions</p>
                <p className="text-purple-600/70 dark:text-purple-400/70 mt-1">Scheduled<br/>Data Collection</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <Database className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <p className="font-semibold text-green-700 dark:text-green-300">Data Store</p>
                <p className="text-green-600/70 dark:text-green-400/70 mt-1">ADX / Log Analytics<br/>/ ADLS</p>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                <BarChart3 className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                <p className="font-semibold text-orange-700 dark:text-orange-300">Visualization</p>
                <p className="text-orange-600/70 dark:text-orange-400/70 mt-1">Grafana /<br/>Power BI</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-[hsl(var(--muted-foreground))]">
              <ArrowRight className="w-4 h-4" /><span className="text-xs">Data flows left to right — collected every 15 minutes</span>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Key Dashboard Panels</h3>
          <Table
            headers={['Panel', 'Data Source', 'Refresh']}
            rows={[
              ['Total Spend (MTD)', 'Cost Management API', 'Daily'],
              ['Cost by Model', 'Cost Management (by resource)', 'Daily'],
              ['Token Usage by Deployment', 'Azure Monitor Metrics', '15 min'],
              ['PTU Utilization %', 'Azure Monitor Metrics', '5 min'],
              ['PAYG Token Burn Rate', 'Azure Monitor Metrics', '15 min'],
              ['Cost Forecast (EOM)', 'Cost Management API', 'Daily'],
              ['Rate Limiting Events (429s)', 'Azure Monitor', '5 min'],
              ['Latency by Deployment (P95)', 'Azure Monitor', '5 min'],
              ['Top Consumers (by team)', 'Custom tagging + Cost API', 'Daily'],
            ]}
          />
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 7. Cost Optimization */}
        <Section id="cost-optimization" title="Cost Optimization Strategies" icon={TrendingDown}>
          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">1. Prioritize PTU Over PAYG</h3>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-3 font-mono text-xs text-[hsl(var(--foreground))]">
            Request → APIM Gateway → Check PTU capacity<br/>
            {"                          ├── Available → Route to PTU ✅"}<br/>
            {"                          └── Full → Overflow to PAYG 💰"}
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">PTU at 70%+ utilization is typically 40-60% cheaper than equivalent PAYG.</p>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">2. Right-Size Your Models</h3>
          <Table
            headers={['Task', 'Recommended Model', 'Savings vs GPT-4o']}
            rows={[
              ['Simple classification', 'GPT-4o-mini', '94% cheaper'],
              ['Code generation', 'GPT-4.1', '20% cheaper'],
              ['Text summarization', 'GPT-4.1-mini', '84% cheaper'],
              ['Embeddings', 'text-embedding-3-small', '99% cheaper'],
              ['Routing / triage', 'GPT-4.1-nano', '96% cheaper'],
            ]}
          />

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">3. Optimize Token Usage</h3>
          <ul className="text-sm text-[hsl(var(--muted-foreground))] space-y-1">
            <li>• <strong>Reduce system prompts</strong> — cache static instructions</li>
            <li>• <strong>Structured outputs</strong> — control response format</li>
            <li>• <strong>Semantic caching</strong> — cache similar queries (APIM supports this)</li>
            <li>• <strong>Set max_tokens</strong> — limit completion length</li>
            <li>• <strong>Batch API</strong> — 50% discount for non-real-time workloads</li>
          </ul>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Common Anti-Patterns</h3>
          <Table
            headers={['Anti-Pattern', 'Problem', 'Fix']}
            rows={[
              ['Underutilized PTUs', 'Paying for unused capacity', 'Monitor utilization, downsize at renewal'],
              ['All traffic on PAYG', 'Unpredictable costs at scale', 'Move baseline to PTU'],
              ['GPT-4o for everything', '17x more expensive than mini', 'Implement model routing'],
              ['No token monitoring', "Can't identify cost drivers", 'Enable diagnostic logs + dashboards'],
              ['Oversized context', '100K tokens when 5K is enough', 'Implement context truncation'],
              ['No semantic caching', 'Paying for duplicate queries', 'Add APIM semantic cache'],
              ['No budget alerts', 'Surprise bills', 'Set daily/weekly alerts'],
            ]}
          />
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 8. Enterprise Best Practices */}
        <Section id="enterprise" title="Enterprise Best Practices (FSI-Ready)" icon={Building}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-[hsl(var(--primary))]" /> Governance
              </h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>• Separate resources per environment (dev/staging/prod)</li>
                <li>• Separate resources per model family</li>
                <li>• Consistent resource tags: team, project, costcenter</li>
                <li>• RBAC: Cognitive Services User (not Contributor)</li>
                <li>• Private endpoints for all production resources</li>
              </ul>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-[hsl(var(--primary))]" /> Cost Accountability
              </h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>• Tag all resources with team/project identifiers</li>
                <li>• Use Cost Management exports grouped by tags</li>
                <li>• Publish monthly showback reports per team</li>
                <li>• Track per-team token usage via App Insights</li>
                <li>• Build automated chargeback reports</li>
              </ul>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Alerting Thresholds</h3>
          <Table
            headers={['Alert', 'Threshold', 'Action']}
            rows={[
              ['Daily PAYG spend', '>120% of daily budget', 'Investigate anomalous usage'],
              ['PTU utilization', '<40% for 7 days', 'Consider downsizing'],
              ['PTU utilization', '>90% sustained', 'Scale up or add PAYG overflow'],
              ['429 rate limiting', '>100/hour', 'Increase capacity or load balance'],
              ['Monthly forecast', '>110% of budget', 'Executive escalation'],
            ]}
          />
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 9. Case Study */}
        <Section id="case-study" title="Customer Implementation Example" icon={Building}>
          <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-5">
            <h3 className="font-semibold text-[hsl(var(--foreground))] mb-3">Large Financial Services Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">❌ Before</h4>
                <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                  <li>• 5 resources, 12 deployments, 3 regions</li>
                  <li>• No per-model cost visibility</li>
                  <li>• $180K/month total — no breakdown</li>
                  <li>• PTU utilization unknown</li>
                  <li>• PAYG costs spiking unpredictably</li>
                </ul>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                <h4 className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">✅ After (3 months)</h4>
                <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                  <li>• 📉 <strong>35% cost reduction</strong> → $117K/month</li>
                  <li>• 📊 Real-time per-model cost visibility</li>
                  <li>• 🎯 PTU utilization: 45% → 78%</li>
                  <li>• ⚡ PAYG spend reduced 60%</li>
                  <li>• 🔔 Zero surprise bills</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              <strong>What they did:</strong> Tagged resources, deployed Azure Functions for metric collection, built Grafana dashboards, implemented model routing via APIM (simple → mini, complex → GPT-4o), set up budget alerts.
            </p>
          </div>
        </Section>

        <div className="border-t border-[hsl(var(--border))]" />

        {/* 10. Cheat Sheet */}
        <Section id="cheat-sheet" title="Quick Reference Cheat Sheet" icon={CheckSquare} defaultOpen={true}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2">📋 Daily Checklist</h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>☐ Check PTU utilization (target: 60-80%)</li>
                <li>☐ Review PAYG spend vs daily budget</li>
                <li>☐ Check for 429 rate limiting events</li>
                <li>☐ Verify all deployments are healthy</li>
              </ul>
            </div>
            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-xl p-4">
              <h4 className="font-semibold text-[hsl(var(--foreground))] text-sm mb-2">📋 Monthly Review</h4>
              <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
                <li>☐ Compare actual vs forecast</li>
                <li>☐ Review per-model cost breakdown</li>
                <li>☐ Evaluate PTU sizing</li>
                <li>☐ Check for underutilized deployments</li>
                <li>☐ Update cost forecasts</li>
                <li>☐ Publish showback reports</li>
              </ul>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] mt-4">Key Metrics & Targets</h3>
          <Table
            headers={['Metric', 'Target', 'Red Flag']}
            rows={[
              ['PTU Utilization', '60-80%', '<40% or >95%'],
              ['PAYG vs Budget', '<100% daily', '>120% daily'],
              ['429 Rate (hourly)', '<10', '>100'],
              ['Cost Trend (MoM)', 'Stable or decreasing', '>20% increase'],
              ['Token Efficiency', 'Decreasing per request', 'Increasing per request'],
            ]}
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <a href="https://azure.microsoft.com/pricing/details/cognitive-services/openai-service/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-1.5 rounded-lg">Azure Pricing <ExternalLink className="w-3 h-3" /></a>
            <a href="https://learn.microsoft.com/azure/ai-services/openai/how-to/quota" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-1.5 rounded-lg">Quota Management <ExternalLink className="w-3 h-3" /></a>
            <a href="https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-1.5 rounded-lg">PTU Docs <ExternalLink className="w-3 h-3" /></a>
            <a href="https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-[hsl(var(--primary))] hover:underline bg-[hsl(var(--primary)/0.05)] px-3 py-1.5 rounded-lg">APIM AI Gateway <ExternalLink className="w-3 h-3" /></a>
          </div>
        </Section>
      </div>
    </div>
  );
}
