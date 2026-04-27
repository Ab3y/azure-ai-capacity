# Azure AI Capacity Dashboard (Beta) — Implementation Plan

## Problem Statement
Build a modern, responsive web application (currently in **Beta**) that gives users a clear, visual understanding of their Azure AI capacity — quotas, usage, limits, and deployment health across Azure OpenAI, Azure AI Services, and Azure Machine Learning resources. The app supports two modes:

1. **Demo Mode** (no Azure connection required) — Displays realistic sample data so users can explore the full dashboard, understand how Azure AI capacity works, learn about quotas/deployment types/regions, and review best practices — all without needing an Azure subscription or login.
2. **Connected Mode** — Connects to the user's Azure tenant via Microsoft Entra ID (MSAL), pulls real-time quota and usage data from Azure Resource Manager APIs, and presents live data.

Both modes present data through interactive charts, gauges, and tables with contextual tooltips linking to official Microsoft documentation and best practices.

## Tech Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 + TypeScript | Component model, ecosystem, type safety |
| Build | Vite | Fast dev server, zero-config |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, dark mode built-in, polished components |
| Charts | Recharts + custom gauges | Composable React charts, lightweight |
| Data Tables | TanStack Table (React Table v8) | Headless, sortable, filterable, paginated tables |
| Authentication | MSAL.js (@azure/msal-browser) | Official Microsoft Entra ID auth library for SPAs |
| Azure SDK | @azure/arm-cognitiveservices, @azure/arm-machinelearning, @azure/arm-quota | Official Azure SDK for JS — quota & deployment data |
| State Management | Zustand | Lightweight, works well with async data fetching |
| Data Fetching | TanStack Query (React Query) | Caching, background refresh, loading/error states |
| Icons | Lucide React | Clean, consistent icon set |
| Tooltips | Radix UI (via shadcn) | Accessible, composable |
| Notifications | Sonner | shadcn-compatible toast library |
| Routing | React Router v6 | Client-side routing for multi-page layout |

All UI runs in-browser — the only "backend" is direct HTTPS calls to Azure ARM APIs via the user's access token.

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           App Shell (React Router)                      │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Top Nav: Logo | Subscription Picker | Region Filter | Dark Mode  │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────┐  ┌───────────────────────────────────────────────────────┐ │
│  │  Side    │  │  Main Content Area (routed pages)                    │ │
│  │  Nav     │  │                                                       │ │
│  │          │  │  📊 Dashboard     — summary gauges & charts          │ │
│  │ Dashboard│  │  📋 Quota Table   — all models, limits, usage        │ │
│  │ Quotas   │  │  🚀 Deployments  — active deployments + health      │ │
│  │ Deploy   │  │  📈 Analytics    — trends, forecasting, alerts       │ │
│  │ Analytics│  │  🗺️ Region Map   — regional availability heatmap    │ │
│  │ Regions  │  │  📖 Best Prac.   — curated guidance + tooltips       │ │
│  │ Guides   │  │  ⚙️ Settings     — preferences, refresh interval    │ │
│  │ Settings │  │                                                       │ │
│  └──────────┘  └───────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  Status Bar: Last Refreshed | Connected Tenant | Sub Count | Help │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

### Data Flow
```
User Browser
  │
  ├─── MSAL.js ───► Microsoft Entra ID ───► Access Token
  │
  ├─── Azure SDK (with token) ──►  ARM APIs
  │       ├── /subscriptions/{id}/providers/Microsoft.CognitiveServices/...
  │       ├── /subscriptions/{id}/providers/Microsoft.MachineLearning/...
  │       ├── /subscriptions/{id}/providers/Microsoft.Quota/...
  │       └── /subscriptions/{id}/providers/Microsoft.CognitiveServices/accounts/{}/usages
  │
  └─── TanStack Query (cache, background refresh, stale-while-revalidate)
          │
          └──► Zustand Store ──► React Components (charts, tables, gauges)
```

---

## Azure AI Resource & Model Categories

### 1. Azure OpenAI Service
| Model Family | Deployment Types | Docs |
|-------------|-----------------|------|
| GPT-4o / GPT-4o mini | Standard, Global Standard, Provisioned (PTU) | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| GPT-4.1 / GPT-4.1 mini / GPT-4.1 nano | Standard, Global Standard | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| o3 / o4-mini | Standard, Global Standard, DataZone Standard | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| GPT-4 / GPT-4 Turbo | Standard, Provisioned | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| DALL-E 3 | Standard | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| Whisper | Standard | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |
| Text Embedding (ada-002, 3-small, 3-large) | Standard, Global Standard | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |

### 2. Azure AI Foundry — Third-Party Models (Models as a Service)
| Provider | Models | Docs |
|----------|--------|------|
| Anthropic | Claude 4 Sonnet, Claude 4 Opus, Claude 3.5 Haiku | https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-anthropic |
| Meta | Llama 4 Scout, Llama 4 Maverick, Llama 3.3 70B | https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-llama |
| Mistral | Mistral Large, Mistral Small, Codestral | https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-mistral |
| Cohere | Command R+, Command R, Embed v3 | https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-cohere |
| DeepSeek | DeepSeek-R1, DeepSeek-V3 | https://learn.microsoft.com/azure/ai-studio/how-to/deploy-models-deepseek |

### 3. Azure Machine Learning
| Resource | Quota Type | Docs |
|----------|-----------|------|
| Compute Clusters | vCPU per VM family per region | https://learn.microsoft.com/azure/machine-learning/how-to-manage-quotas |
| Compute Instances | vCPU per region | https://learn.microsoft.com/azure/machine-learning/concept-compute-instance |
| Managed Online Endpoints | vCPU per VM SKU per region | https://learn.microsoft.com/azure/machine-learning/how-to-manage-quotas |
| Serverless Endpoints | Requests per minute / Tokens per minute | https://learn.microsoft.com/azure/machine-learning/how-to-manage-quotas |

---

## Feature Breakdown (Todos)

### Phase 1: Project Scaffolding
- **scaffold-project**: Initialize Vite + React + TypeScript project with Tailwind CSS, install all dependencies (shadcn/ui, recharts, tanstack-query, tanstack-table, msal-browser, azure SDK packages, zustand, lucide-react, react-router, sonner)
- **msal-config**: Create MSAL configuration for Microsoft Entra ID app registration — redirect URIs, scopes (`https://management.azure.com/.default`), popup vs redirect strategy

### Phase 2: Authentication & Azure Connection
- **auth-provider**: Implement MSAL auth provider wrapping the app — login, logout, silent token acquisition, account picker for multi-tenant users
- **auth-guard**: Protected route wrapper that redirects unauthenticated users to login
- **subscription-picker**: After login, fetch all accessible subscriptions via ARM API and let user select one or more to monitor
- **tenant-display**: Show connected tenant name, user email, and subscription in the status bar

### Phase 2b: Demo Mode (No Azure Connection Required)
- **demo-mode**: The app can run in **Demo Mode** without any Azure authentication or connection. This allows:
  - Users to explore the full dashboard UI with realistic sample data
  - Organizations to evaluate the tool before connecting to Azure
  - Learning/training scenarios where users can understand how Azure AI capacity, quotas, deployment types, and regions work
  - Developers to work on the UI without needing Azure credentials
  - The Login page offers two buttons: "Sign in with Microsoft" (connected mode) and "Explore Demo" (demo mode)
  - A persistent banner at the top indicates demo mode with a "Connect to Azure" CTA to upgrade
  - Demo mode state is stored in Zustand and persisted in localStorage
  - All pages display the same UI with sample/simulated data instead of live API calls
  - Demo mode data is realistic and educational — it shows varied utilization levels, multiple models, regions, and deployment types so users understand real-world capacity scenarios

### Phase 3: Core Layout & Theme
- **app-shell**: Build the responsive layout — collapsible side navigation, top bar, main content area, status bar
- **dark-mode**: Dark/light mode toggle with system preference detection and localStorage persistence
- **routing**: React Router setup with routes for Dashboard, Quotas, Deployments, Analytics, Regions, Guides, Settings
- **loading-states**: Skeleton loaders, shimmer effects, and error boundaries for all data-driven views

### Phase 4: Data Layer — Azure API Integration
- **quota-service**: Service module to fetch quota limits and current usage for Azure OpenAI, Cognitive Services, and ML resources per subscription/region
  - `GET /subscriptions/{id}/providers/Microsoft.CognitiveServices/locations/{region}/usages`
  - `GET /subscriptions/{id}/providers/Microsoft.CognitiveServices/accounts/{name}/usages`
  - Docs: https://learn.microsoft.com/rest/api/cognitiveservices/
- **deployment-service**: Fetch active Azure OpenAI deployments with model info, SKU, capacity, and provisioning state
  - `GET /subscriptions/{id}/providers/Microsoft.CognitiveServices/accounts/{name}/deployments`
- **ml-quota-service**: Fetch Azure ML compute quotas (vCPU limits and usage per VM family)
  - `GET /subscriptions/{id}/providers/Microsoft.MachineLearningServices/locations/{region}/usages`
- **rate-limit-handler**: Implement retry-after logic and request throttling to respect ARM API rate limits (429 handling with exponential backoff)
- **data-caching**: TanStack Query configuration — stale time, cache time, background refetch intervals, query key structure

### Phase 5: Dashboard — Visual Summary
- **summary-cards**: Top-level metric cards showing:
  - Total models deployed / Total quota allocated
  - Overall capacity utilization % (across all models)
  - Subscriptions monitored
  - Regions with active deployments
- **usage-gauges**: Circular gauge/donut charts per model family showing used vs. available quota (e.g., GPT-4o: 120K / 240K TPM)
- **utilization-heatmap**: Color-coded grid showing utilization levels across models × regions (green < 50%, yellow 50-80%, red > 80%)
- **top-consumers**: Bar chart showing top 5 models/deployments by usage
- **alerts-banner**: Warning banner when any quota exceeds 80% utilization threshold

### Phase 6: Quota Table — Detailed View
- **quota-table**: Full-featured data table with columns:
  - Model Name | Deployment Type | Region | Quota Limit (TPM) | Current Usage (TPM) | Usage % | Status
  - Sortable, filterable, searchable, paginated
- **quota-filters**: Filter bar — Model family dropdown, Region multi-select, Deployment type, Usage threshold slider (show only > X%)
- **quota-export**: Export table as CSV or JSON for reporting
- **inline-tooltips**: Hover on any model name to see description, pricing tier, docs link, and best-practice tips
- **quota-request-link**: "Request Increase" button per row linking to Azure portal quota request page
  - Link: https://portal.azure.com/#view/Microsoft_Azure_Capacity/QuotaMenuBlade/~/myQuotas

### Phase 7: Deployments View
- **deployment-list**: Card or table view of all active Azure OpenAI deployments:
  - Account name | Model | Version | Capacity (TPM/PTU) | Provisioning State | Created Date | Region
- **deployment-health**: Health indicator per deployment — green (active), yellow (updating), red (failed)
- **deployment-details**: Click into a deployment to see full details: content filter config, rate limits, version info
- **deployment-grouping**: Group deployments by account, region, or model family

### Phase 8: Analytics — Trends & Forecasting
- **usage-trends**: Line chart showing quota usage over time (daily/weekly/monthly) per model
- **growth-projection**: Simple linear projection showing when current usage will hit quota limits at current growth rate
- **comparison-view**: Side-by-side comparison of usage across regions or models
- **cost-correlation**: Overlay estimated cost on usage charts (based on Azure pricing for tokens consumed)

### Phase 9: Regional Availability Map
- **region-map**: Interactive world map or grid showing Azure regions with AI service availability
- **region-details**: Click a region to see: available models, current quota, usage, and deployment count
- **availability-matrix**: Table showing Model × Region availability with quota status per cell
- **region-recommendations**: Suggest alternative regions when primary region is at high utilization

---

## Phase 10: Best Practices & Documentation Hub

### Tooltips & Contextual Help
Every data point, model name, and metric in the app includes contextual tooltips with:
- Brief explanation of the concept
- Current value and what it means
- Link to official Microsoft documentation
- Best-practice recommendation

### Built-In Guidance Pages
Curated best-practice content linking to official Microsoft Learn resources:

| Topic | Content | Docs |
|-------|---------|------|
| Quota Management | How to monitor, plan, and request quota increases | https://learn.microsoft.com/azure/ai-services/openai/how-to/quota |
| Deployment Strategies | Standard vs Provisioned (PTU) vs Global Standard — when to use each | https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types |
| Rate Limiting | Understanding TPM/RPM limits, retry strategies, load balancing | https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#understanding-rate-limits |
| Provisioned Throughput | Planning PTU capacity, reserved vs on-demand, cost optimization | https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput |
| Content Filtering | Default filters, custom filters, and impact on throughput | https://learn.microsoft.com/azure/ai-services/openai/concepts/content-filter |
| Multi-Region Strategy | Distributing workloads across regions for resilience and capacity | https://learn.microsoft.com/azure/ai-services/openai/how-to/business-continuity-disaster-recovery |
| Cost Optimization | Token-based pricing, choosing the right model tier, batching strategies | https://learn.microsoft.com/azure/ai-services/openai/concepts/models#pricing |
| API Management Gateway | Using APIM as an AI gateway for load balancing, caching, rate limiting | https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities |
| Well-Architected AI | Reliability, security, cost, operational excellence for AI workloads | https://learn.microsoft.com/azure/well-architected/service-guides/azure-openai |
| Model Lifecycle | Model deprecation, version upgrades, migration planning | https://learn.microsoft.com/azure/ai-services/openai/concepts/model-retirements |

### Tooltip Examples
- **TPM (Tokens Per Minute)**: "The maximum number of tokens your deployment can process per minute. Shared across all requests. [Learn more →](https://learn.microsoft.com/azure/ai-services/openai/how-to/quota)"
- **PTU (Provisioned Throughput Units)**: "Reserved capacity for predictable latency and throughput. Best for production workloads with consistent demand. [Learn more →](https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput)"
- **Global Standard**: "Leverages Azure's global infrastructure to route traffic dynamically. Higher default quotas, variable latency. [Learn more →](https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types)"

---

## Phase 10b: Quota Change Walkthrough — Increase & Decrease Capacity

A **prominent, step-by-step guide** embedded directly in the app that walks users and organizations through the official process of increasing or decreasing their Azure AI capacity. This should be accessible from multiple entry points: a dedicated nav page, inline "Request Increase" buttons on the Quota table, and contextual callout banners on the Dashboard when quotas are high or underutilized.

### Increase Quota — Step-by-Step Walkthrough
The guide covers these official Microsoft-documented methods:

| Step | Action | Details | Docs |
|------|--------|---------|------|
| 1 | **Identify the Quota to Change** | Determine the model, deployment type, and region for which you need more capacity. Use this dashboard's Quota Table to find quotas at or near their limits. | — |
| 2 | **Azure Portal — Self-Service Increase** | Navigate to Azure Portal → Quotas → My Quotas → Microsoft.CognitiveServices. Select the quota, click "Request increase", and enter the desired new limit. Most Standard quota increases are auto-approved. | https://learn.microsoft.com/azure/ai-services/openai/how-to/quota |
| 3 | **Azure CLI — Programmatic Request** | Use `az quota create` or `az cognitiveservices account deployment create --capacity` to request quota changes programmatically. Useful for automation and IaC workflows. | https://learn.microsoft.com/cli/azure/cognitiveservices/account/deployment |
| 4 | **Provisioned Throughput (PTU) Requests** | PTU capacity requires a separate request process. Submit via the Azure Portal PTU onboarding form or contact your Microsoft account team. PTU is allocated regionally and requires a commitment. | https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput |
| 5 | **Enterprise / Large-Scale Requests** | For quota increases beyond self-service limits, file an Azure Support ticket (Cognitive Services → Azure OpenAI → Quota). Include: subscription ID, model, region, desired limit, and business justification. | https://learn.microsoft.com/azure/ai-services/openai/quotas-limits |
| 6 | **Global Standard / DataZone Migration** | If Standard regional quota is limited, consider migrating to Global Standard or DataZone Standard deployments which offer higher default limits. | https://learn.microsoft.com/azure/ai-services/openai/how-to/deployment-types |

### Decrease Quota / Release Capacity
| Step | Action | Details | Docs |
|------|--------|---------|------|
| 1 | **Delete Unused Deployments** | Remove deployments that are no longer needed. Deployed capacity counts against your quota even if not actively processing requests. | https://learn.microsoft.com/azure/ai-services/openai/how-to/create-resource |
| 2 | **Scale Down Deployment Capacity** | Reduce the TPM/PTU allocation on existing deployments via Azure Portal or CLI: `az cognitiveservices account deployment create --capacity <lower-value>`. | https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#assign-quota |
| 3 | **Downsize PTU Reservations** | PTU commitments can be adjusted at renewal. Plan downsizing before the commitment period ends to avoid paying for unused capacity. | https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput |
| 4 | **Consolidate to Fewer Regions** | If deployments are spread thin across many regions, consolidate to fewer regions to simplify management and potentially use higher per-region limits. | https://learn.microsoft.com/azure/ai-services/openai/how-to/business-continuity-disaster-recovery |
| 5 | **Switch to Smaller Models** | Migrate workloads from large models (GPT-4o) to smaller, cheaper models (GPT-4o-mini, GPT-4.1-nano) where quality requirements allow. | https://learn.microsoft.com/azure/ai-services/openai/concepts/models |

### UI Entry Points
- **Dashboard Alert Banner**: When any quota exceeds 80%, show a prominent "Need More Capacity?" CTA linking to the increase walkthrough
- **Quota Table "Request Increase" Button**: Per-row action that opens the walkthrough pre-filled with the model/region context
- **Underutilization Banner**: When a deployment is under 20% utilized, suggest decreasing capacity with a link to the decrease walkthrough
- **Dedicated Nav Page**: `/guides/capacity-changes` — full step-by-step walkthrough with expandable sections
- **Sidebar Quick Link**: Permanent "Manage Capacity" link in the side navigation

### Feature Todo
- **quota-change-guide**: Build a dedicated QuotaChangeGuide component with step-by-step accordion walkthrough for both increasing and decreasing capacity, with direct links to Azure Portal actions, CLI commands, and support ticket filing

---

## Phase 11: Nice-to-Have Features

### 11a. Capacity Planning Calculator
- **capacity-calculator**: Interactive calculator where users input:
  - Expected requests per minute
  - Average input/output token counts
  - Target latency requirements
  - The calculator recommends: deployment type (Standard vs PTU), required TPM quota, estimated monthly cost, and optimal region
  - Docs: https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#calculate-required-quota

### 11b. Quota Alert Configuration
- **alert-config**: Set custom threshold alerts per model (e.g., "Alert me when GPT-4o usage exceeds 75%")
  - In-app notification bell with alert history
  - Browser push notifications (Notification API)
  - Email webhook integration (optional, via Azure Logic Apps or Power Automate)
  - Color-coded severity: Info (50%), Warning (75%), Critical (90%)

### 11c. Multi-Subscription Comparison
- **multi-sub-view**: Side-by-side comparison of quota and usage across multiple Azure subscriptions
  - Aggregate view showing total capacity across all subscriptions
  - Identify which subscription has available headroom for new deployments
  - Useful for enterprise customers with multiple subscriptions

### 11d. Export & Reporting
- **report-pdf**: Generate a professional PDF capacity report including:
  - Executive summary with key metrics
  - Quota utilization charts (embedded)
  - Deployment inventory table
  - Recommendations section
  - Timestamp and subscription details
- **report-scheduled**: Schedule automatic report generation (weekly/monthly) saved to browser downloads
- **export-dashboard**: Export dashboard charts as PNG/SVG images for presentations

### 11e. Deployment Recommendations Engine
- **recommendations**: AI-powered (or rule-based) recommendations:
  - "Consider Global Standard for GPT-4o-mini — 50% higher default quota"
  - "East US 2 has lower utilization than East US — consider migrating Deployment X"
  - "Your PTU utilization is only 30% — consider downsizing to save cost"
  - "Model gpt-4-0613 is retiring on [date] — plan migration to gpt-4o"
  - Each recommendation links to relevant Azure docs

### 11f. Token Usage Simulator
- **token-simulator**: Paste a sample prompt/response and the simulator:
  - Tokenizes it using tiktoken (WASM build for browser)
  - Shows token count breakdown (input vs output)
  - Estimates cost per request
  - Projects daily/monthly cost at a given request volume
  - Docs: https://learn.microsoft.com/azure/ai-services/openai/how-to/quota#estimate-token-usage

### 11g. Change Log & Drift Detection
- **change-log**: Track changes to quota and deployments over time
  - Snapshot current state on each refresh (stored in IndexedDB)
  - Highlight what changed since last visit (new deployments, quota changes, model retirements)
  - Timeline view of capacity changes

### 11h. Cost Dashboard
- **cost-view**: Estimated cost visualization based on usage and Azure pricing:
  - Monthly burn rate per model
  - Cost per deployment
  - Comparison of Standard vs PTU cost at current usage
  - "What-if" scenarios (e.g., "What if I move 50% of traffic to GPT-4o-mini?")
  - Link to Azure Cost Management: https://learn.microsoft.com/azure/cost-management-billing/

### 11i. Favorite & Pin Resources
- **favorites**: Pin specific models, deployments, or regions to a "Favorites" dashboard section for quick monitoring
  - Stored in localStorage
  - Quick-access card grid at the top of the dashboard

### 11j. Command Palette
- **command-palette**: Ctrl+K / Cmd+K command palette for quick navigation:
  - Jump to any page, model, deployment, or region
  - Quick actions: refresh data, toggle theme, export report, switch subscription
  - Fuzzy search across all entities

### 11k. Onboarding Tour
- **onboarding-tour**: First-time guided walkthrough (react-joyride):
  - Step 1: "Connect to Azure" — authentication
  - Step 2: "Select Subscriptions" — subscription picker
  - Step 3: "Your Dashboard" — explain gauges and metrics
  - Step 4: "Drill into Quotas" — table navigation
  - Step 5: "Best Practices" — tooltips and docs
  - Show once, stored in localStorage, "Replay Tour" button in settings

### 11l. Real-Time WebSocket Updates (Advanced)
- **live-updates**: Optional WebSocket or polling mechanism for near-real-time usage updates
  - Azure Event Grid integration for deployment state changes
  - Auto-refresh dashboard on detected changes
  - Live usage counter animation

### 11m. Multi-Tenant Support
- **multi-tenant**: For users with access to multiple Azure AD tenants:
  - Tenant picker in the top nav
  - Switch between tenants without re-login (MSAL silent auth)
  - Aggregate view across tenants

### 11n. Accessibility (a11y)
- **accessibility**: WCAG 2.1 AA compliance:
  - Full keyboard navigation
  - ARIA labels on all interactive elements and charts
  - Screen reader announcements for data updates
  - Focus rings visible in both themes
  - Reduced motion support via `prefers-reduced-motion`
  - High-contrast color scheme for charts (colorblind-safe palettes)

### 11o. PWA & Offline Support
- **pwa-support**: Progressive Web App configuration:
  - Service worker for offline caching of static assets and last-fetched data
  - Install prompt for desktop/mobile
  - Offline banner indicating stale data
  - App manifest with Azure AI-themed icons

### 11p. APIM AI Gateway Integration
- **apim-integration**: For users with Azure API Management AI Gateway:
  - Show APIM-managed endpoints alongside direct Azure OpenAI deployments
  - Display APIM rate limits, token policies, and backend pool configuration
  - Docs: https://learn.microsoft.com/azure/api-management/genai-gateway-capabilities

---

## Best Practices Incorporated Into the App

These practices are baked into the application design, not just documented:

| Practice | How It's Applied | Reference |
|----------|-----------------|-----------|
| Proactive Quota Monitoring | Threshold alerts at 50/75/90% with visual indicators | https://learn.microsoft.com/azure/ai-services/openai/how-to/quota |
| Multi-Region Resilience | Region map highlights failover candidates with available capacity | https://learn.microsoft.com/azure/ai-services/openai/how-to/business-continuity-disaster-recovery |
| Right-Sizing Deployments | Recommendations engine flags over/under-provisioned PTU deployments | https://learn.microsoft.com/azure/ai-services/openai/concepts/provisioned-throughput |
| Model Version Tracking | Change log tracks model versions and flags upcoming retirements | https://learn.microsoft.com/azure/ai-services/openai/concepts/model-retirements |
| Cost Awareness | Cost dashboard overlays pricing on usage data | https://learn.microsoft.com/azure/cost-management-billing/ |
| Security Best Practices | MSAL-based auth with minimal scopes, no token storage in localStorage | https://learn.microsoft.com/azure/active-directory/develop/msal-js-initializing-client-applications |
| ARM API Efficiency | Request throttling, caching, background refresh to avoid 429s | https://learn.microsoft.com/azure/azure-resource-manager/management/request-limits-and-throttling |
| Accessible Design | WCAG 2.1 AA, keyboard nav, screen reader support, colorblind-safe charts | https://learn.microsoft.com/azure/well-architected/operational-excellence/observability |

---

## File Structure

```
azure-ai-capacity/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── public/
│   ├── favicon.svg
│   └── manifest.json                  # PWA manifest
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css                      # Tailwind imports + custom styles
│   ├── auth/
│   │   ├── msalConfig.ts              # MSAL configuration (clientId, authority, scopes)
│   │   ├── AuthProvider.tsx           # MSAL context provider
│   │   ├── AuthGuard.tsx              # Protected route wrapper
│   │   └── useAuth.ts                 # Auth hook (login, logout, token, account)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx           # Responsive shell (sidebar + top nav + content)
│   │   │   ├── SideNav.tsx            # Collapsible side navigation
│   │   │   ├── TopBar.tsx             # Subscription picker, region filter, dark mode
│   │   │   ├── StatusBar.tsx          # Connected tenant, last refresh, help
│   │   │   └── ThemeToggle.tsx        # Dark/light mode switch
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx      # Dashboard layout
│   │   │   ├── SummaryCards.tsx       # Metric cards (total models, utilization, etc.)
│   │   │   ├── UsageGauge.tsx         # Circular gauge component
│   │   │   ├── UtilizationHeatmap.tsx # Model × Region heatmap
│   │   │   ├── TopConsumersChart.tsx  # Bar chart of top usage
│   │   │   └── AlertsBanner.tsx       # High utilization warnings
│   │   ├── quotas/
│   │   │   ├── QuotaPage.tsx          # Quota table page
│   │   │   ├── QuotaTable.tsx         # TanStack Table with sorting/filtering
│   │   │   ├── QuotaFilters.tsx       # Filter bar (model, region, type, threshold)
│   │   │   ├── QuotaRow.tsx           # Row component with inline tooltips
│   │   │   └── QuotaExport.tsx        # CSV/JSON export button
│   │   ├── deployments/
│   │   │   ├── DeploymentsPage.tsx     # Deployments list/grid
│   │   │   ├── DeploymentCard.tsx      # Deployment summary card
│   │   │   ├── DeploymentDetails.tsx   # Expanded detail view
│   │   │   └── DeploymentHealth.tsx    # Health indicator component
│   │   ├── analytics/
│   │   │   ├── AnalyticsPage.tsx       # Trends & forecasting
│   │   │   ├── UsageTrendChart.tsx     # Line chart over time
│   │   │   ├── GrowthProjection.tsx    # Projected quota exhaustion
│   │   │   ├── ComparisonView.tsx      # Side-by-side comparisons
│   │   │   └── CostCorrelation.tsx     # Cost overlay on usage
│   │   ├── regions/
│   │   │   ├── RegionsPage.tsx         # Regional availability view
│   │   │   ├── RegionMap.tsx           # Interactive region grid/map
│   │   │   ├── AvailabilityMatrix.tsx  # Model × Region availability table
│   │   │   └── RegionRecommendation.tsx# Alternative region suggestions
│   │   ├── guides/
│   │   │   ├── GuidesPage.tsx          # Best practices hub
│   │   │   ├── GuideCard.tsx           # Individual guide card with docs link
│   │   │   └── TooltipContent.tsx      # Reusable tooltip content definitions
│   │   ├── settings/
│   │   │   ├── SettingsPage.tsx        # App preferences
│   │   │   ├── AlertConfig.tsx         # Custom alert thresholds
│   │   │   └── RefreshConfig.tsx       # Data refresh interval settings
│   │   ├── shared/
│   │   │   ├── SkeletonLoader.tsx      # Loading skeleton component
│   │   │   ├── ErrorBoundary.tsx       # Error boundary with retry
│   │   │   ├── EmptyState.tsx          # Empty state illustrations
│   │   │   ├── InfoTooltip.tsx         # Reusable tooltip with docs link
│   │   │   ├── StatusBadge.tsx         # Green/yellow/red status badges
│   │   │   ├── MetricCard.tsx          # Reusable metric card
│   │   │   └── ProgressBar.tsx         # Usage progress bar with thresholds
│   │   └── dialogs/
│   │       ├── SubscriptionPicker.tsx  # Multi-subscription selector
│   │       ├── CapacityCalculator.tsx  # Capacity planning calculator
│   │       ├── TokenSimulator.tsx      # Token usage estimator
│   │       └── CommandPalette.tsx      # Ctrl+K quick actions
│   ├── services/
│   │   ├── azureClient.ts             # Base Azure REST client with auth token injection
│   │   ├── quotaService.ts            # Fetch quota limits and usage
│   │   ├── deploymentService.ts       # Fetch deployments and health
│   │   ├── subscriptionService.ts     # Fetch subscriptions and resource groups
│   │   ├── mlQuotaService.ts          # Azure ML compute quota service
│   │   └── rateLimiter.ts             # ARM API throttling and retry logic
│   ├── hooks/
│   │   ├── useQuotas.ts               # TanStack Query hook for quota data
│   │   ├── useDeployments.ts          # TanStack Query hook for deployments
│   │   ├── useSubscriptions.ts        # TanStack Query hook for subscriptions
│   │   ├── useAnalytics.ts            # Hook for trend data aggregation
│   │   └── useAlerts.ts               # Hook for threshold alert checking
│   ├── store/
│   │   ├── useAppStore.ts             # Zustand: theme, selectedSub, selectedRegions
│   │   ├── useAlertStore.ts           # Zustand: alert thresholds, notification history
│   │   └── useHistoryStore.ts         # Zustand: change log snapshots (IndexedDB)
│   ├── data/
│   │   ├── modelCatalog.ts            # Static catalog of Azure AI models with metadata
│   │   ├── regionData.ts              # Azure regions with coordinates and service availability
│   │   ├── tooltipContent.ts          # All tooltip text with docs links
│   │   ├── bestPractices.ts           # Curated best-practice content
│   │   └── pricingData.ts             # Static pricing reference data
│   ├── types/
│   │   ├── azure.ts                   # Azure API response types
│   │   ├── quota.ts                   # Quota, usage, limit interfaces
│   │   ├── deployment.ts              # Deployment interfaces
│   │   └── app.ts                     # App-level types (settings, alerts, etc.)
│   └── utils/
│       ├── formatters.ts              # Number formatting (TPM, %, currency)
│       ├── thresholds.ts              # Utilization threshold logic and colors
│       ├── tokenizer.ts               # Tiktoken WASM wrapper for token simulation
│       ├── pdfExporter.ts             # Dashboard → PDF report
│       └── csvExporter.ts             # Table data → CSV export
```

---

## Implementation Order

1. **scaffold-project** — Vite + React + TypeScript + all dependencies
2. **msal-config** + **auth-provider** + **auth-guard** — Azure authentication
3. **app-shell** + **dark-mode** + **routing** — layout skeleton
4. **subscription-picker** + **tenant-display** — Azure tenant connection
5. **quota-service** + **deployment-service** + **rate-limit-handler** + **data-caching** — API data layer
6. **summary-cards** + **usage-gauges** + **alerts-banner** — dashboard overview
7. **quota-table** + **quota-filters** + **inline-tooltips** + **quota-request-link** — detailed quota view
8. **deployment-list** + **deployment-health** + **deployment-details** — deployment inventory
9. **utilization-heatmap** + **top-consumers** — dashboard charts
10. **usage-trends** + **growth-projection** — analytics basics
11. **region-map** + **availability-matrix** + **region-recommendations** — regional view
12. **guides page** + **tooltip content** — best practices hub
13. **loading-states** + **quota-export** — polish
14. **comparison-view** + **cost-correlation** — advanced analytics (Phase 8)
15. **capacity-calculator** — planning tool (Phase 11a)
16. **alert-config** — custom alert thresholds (Phase 11b)
17. **multi-sub-view** — enterprise multi-subscription (Phase 11c)
18. **report-pdf** + **export-dashboard** — reporting (Phase 11d)
19. **recommendations** — deployment optimization engine (Phase 11e)
20. **token-simulator** — token/cost estimation (Phase 11f)
21. **change-log** — drift detection (Phase 11g)
22. **cost-view** — cost dashboard (Phase 11h)
23. **favorites** — pinned resources (Phase 11i)
24. **command-palette** — quick navigation (Phase 11j)
25. **onboarding-tour** — first-time walkthrough (Phase 11k)
26. **accessibility** — WCAG 2.1 AA (Phase 11n)
27. **pwa-support** — offline & installable (Phase 11o)
28. **multi-tenant** + **apim-integration** + **live-updates** — advanced integrations (Phase 11l/m/p)

---

## Key Design Decisions

1. **No custom backend**: All data comes directly from Azure ARM APIs via the user's MSAL token — zero server infrastructure to maintain
2. **MSAL.js popup auth**: Popup strategy avoids full-page redirect interruptions; falls back to redirect on mobile
3. **TanStack Query for API calls**: Automatic caching, background refresh, stale-while-revalidate — critical for ARM APIs with rate limits
4. **Zustand over Redux**: Simpler API for a dashboard app with limited cross-component state
5. **Recharts over D3**: Declarative React-native charts; D3 is overkill for gauges and line charts
6. **Static pricing data**: Avoids dependency on Azure Retail Prices API (which has CORS limitations); updated periodically in `pricingData.ts`
7. **IndexedDB for history**: Change log and snapshots stored locally in IndexedDB (via idb library) — survives tab refreshes without server storage
8. **shadcn/ui components**: Copy-paste component model gives full control over styling and behavior; Radix primitives ensure accessibility

---

## Notes & Risks

- **Azure App Registration required**: Users need to register an app in Entra ID with `https://management.azure.com/.default` scope. The onboarding flow should guide this with step-by-step instructions.
- **ARM API rate limits**: Azure throttles ARM requests (per-subscription and per-tenant). TanStack Query caching + manual rate limiter are essential.
- **Quota API coverage**: Not all Azure AI models expose quota via the same API surface. Some models (especially third-party MaaS models via AI Foundry) may require different API endpoints or have limited quota visibility.
- **Cross-region data aggregation**: Fetching usage across all regions is N API calls. Use parallel requests with concurrency limits.
- **Pricing data staleness**: Static pricing file needs periodic updates as Azure pricing changes. Consider a CI job to auto-update or a manual "last updated" indicator.
- **Model catalog changes**: Azure frequently adds/retires models. The `modelCatalog.ts` file needs a maintenance strategy.
- **CORS considerations**: All Azure ARM APIs support CORS for browser-based apps when using MSAL tokens. No proxy needed.
