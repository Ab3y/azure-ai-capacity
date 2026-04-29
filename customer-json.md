# Customer JSON Configuration — Feature Plan

## Overview
A single JSON file controls **all data** displayed across the Azure AI Capacity Dashboard. Users can upload a customer-specific JSON file to instantly populate the entire site with that customer's AI setup — models, quotas, deployments, usage, and regions. This enables field engineers and account teams to prepare customer-specific capacity reviews in minutes.

## How It Works

### Entry Points
A persistent **Upload/Config icon** (📁) in the **top navigation bar** provides quick access to:
1. **Upload JSON** — Import a customer JSON file to populate all pages
2. **Download Current** — Export the current site state as a JSON file
3. **Download Template** — Get a blank/sample template to fill in for a customer
4. **Reset to Demo** — Restore the default demo data

### What the JSON Controls
Every page in the dashboard reads from a centralized Zustand store (`useCustomerDataStore`). The JSON file populates this store, and all components react automatically:

| Page | Data Populated |
|------|---------------|
| **Dashboard** | Summary cards, usage gauges, heatmap, top consumers chart, alerts |
| **Quotas** | Full quota table — model, family, type, region, limit, usage, unit |
| **Deployments** | All deployment cards/table — name, account, model, version, SKU, capacity, region, state |
| **Analytics** | Usage trend data over time per model |
| **Regions** | Per-region deployment count and utilization |

---

## JSON Schema

```json
{
  "meta": {
    "customerName": "Contoso",
    "preparedBy": "Your Name",
    "preparedDate": "2026-04-29",
    "subscriptionIds": ["00000000-0000-0000-0000-000000000001"],
    "notes": "Sample customer template — replace with real data"
  },
  "quotas": [
    {
      "model": "gpt-4o",
      "family": "GPT-4o",
      "type": "Standard",
      "region": "East US",
      "limit": 80000,
      "used": 45000,
      "unit": "TPM"
    },
    {
      "model": "gpt-4o-mini",
      "family": "GPT-4o",
      "type": "Standard",
      "region": "East US",
      "limit": 200000,
      "used": 60000,
      "unit": "TPM"
    },
    {
      "model": "text-embedding-3-small",
      "family": "Embeddings",
      "type": "Standard",
      "region": "East US",
      "limit": 350000,
      "used": 120000,
      "unit": "TPM"
    }
  ],
  "deployments": [
    {
      "name": "gpt4o-prod",
      "account": "Contoso-oai-eastus",
      "model": "gpt-4o",
      "version": "2024-11-20",
      "sku": "Standard",
      "capacity": 80,
      "region": "East US",
      "state": "Succeeded",
      "created": "2025-01-10"
    },
    {
      "name": "gpt4o-mini-chat",
      "account": "Contoso-oai-eastus",
      "model": "gpt-4o-mini",
      "version": "2024-07-18",
      "sku": "Standard",
      "capacity": 200,
      "region": "East US",
      "state": "Succeeded",
      "created": "2025-03-05"
    }
  ]
}
```

### Field Reference

#### `meta` (required)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customerName` | string | ✅ | Customer/organization name — displayed in header |
| `preparedBy` | string | ❌ | Who prepared this config |
| `preparedDate` | string | ❌ | ISO date when this was prepared |
| `subscriptionIds` | string[] | ❌ | Azure subscription IDs being tracked |
| `notes` | string | ❌ | Free-text notes about this config |

#### `quotas[]` (required — at least 1)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `model` | string | ✅ | Model name (e.g., `gpt-4o`, `claude-4-sonnet`) |
| `family` | string | ✅ | Model family for grouping (e.g., `GPT-4o`, `Anthropic Claude`) |
| `type` | string | ✅ | Deployment type: `Standard`, `Global Standard`, `Provisioned`, `DataZone Standard`, `Serverless` |
| `region` | string | ✅ | Azure region (e.g., `East US`, `Sweden Central`, `Global`) |
| `limit` | number | ✅ | Quota limit (TPM or RPM) |
| `used` | number | ✅ | Current usage |
| `unit` | string | ✅ | Unit: `TPM` (tokens per minute) or `RPM` (requests per minute) |

#### `deployments[]` (optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Deployment name |
| `account` | string | ✅ | Azure OpenAI account name |
| `model` | string | ✅ | Model deployed |
| `version` | string | ✅ | Model version |
| `sku` | string | ✅ | SKU: `Standard`, `Global Standard`, `Provisioned`, `Serverless` |
| `capacity` | number | ✅ | Allocated capacity (K TPM or PTU) |
| `region` | string | ✅ | Azure region |
| `state` | string | ✅ | `Succeeded`, `Creating`, `Failed`, `Deleting` |
| `created` | string | ✅ | Creation date (YYYY-MM-DD) |

#### `trends[]` (optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | ✅ | Date label (e.g., `Apr 1`, `2026-04-01`) |
| `models` | object | ✅ | Key-value pairs of model name → usage (K TPM) |

#### `regions[]` (optional)
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Azure region code (e.g., `eastus`, `swedencentral`) |
| `deployments` | number | ✅ | Number of active deployments |
| `utilization` | number | ✅ | Average utilization percentage (0-100) |

---

## Usage Instructions

### For Field Engineers / Account Teams

#### Preparing a Customer Config
1. Click the **📁 Config** icon in the top nav → **Download Template**
2. Open the JSON file in any text editor (VS Code recommended)
3. Fill in the `meta` section with the customer name and your details
4. Populate `quotas[]` with the customer's actual model quotas and usage
   - Get this from Azure Portal → Quotas → Microsoft.CognitiveServices
   - Or use the Azure CLI: `az cognitiveservices usage list --location eastus`
5. Populate `deployments[]` with active deployments
   - Get this from Azure Portal → the customer's OpenAI resource → Deployments
   - Or use: `az cognitiveservices account deployment list --name <account> --resource-group <rg>`
6. (Optional) Add `trends[]` if you have historical usage data
7. (Optional) Add `regions[]` to customize the regional view
8. Save the file as `<customer-name>-capacity.json`

#### Loading into the Dashboard
1. Open **https://azure-ai-capacity.azurewebsites.net**
2. Click **Explore Demo** (or sign in)
3. Click the **📁 Config** icon in the top nav
4. Select **Upload JSON**
5. Choose your customer JSON file
6. The entire dashboard instantly updates with the customer's data
7. The customer name appears in the header

#### During a Customer Meeting
- Walk through the **Dashboard** to show overall capacity health
- Use **Quotas** tab to discuss specific model limits and utilization
- Show **Deployments** to review their deployment inventory
- Navigate to **Manage Capacity** if they need to increase/decrease
- Use **Analytics** to discuss usage trends if trend data was provided
- The **Lead Times** page (password-protected) shows estimated fulfillment times

#### Saving / Sharing
- Click **📁 Config** → **Download Current** to save the current state
- Share the JSON file with colleagues — they can upload it on their own browser
- JSON files can be version-controlled in Git for change tracking

### Tips
- You don't need to fill every field — `quotas[]` is the minimum required
- If `deployments[]` is omitted, the Deployments page will show "No data loaded"
- If `trends[]` is omitted, the Analytics page uses a placeholder message
- If `regions[]` is omitted, regions are auto-derived from quota data
- The JSON persists in your browser (localStorage) across refreshes — use **Reset** to clear

---

## Implementation Todos

### Store & Data Layer
- **customer-data-store**: Zustand store (`useCustomerDataStore`) that holds the full customer dataset. All pages read from this store instead of hardcoded constants. Persisted to localStorage.
- **default-demo-data**: Extract all existing hardcoded demo data into a single `defaultDemoData.ts` file that serves as the fallback/reset data.
- **json-validator**: Validation utility that checks uploaded JSON against the schema — ensures required fields exist, types are correct, and provides helpful error messages for malformed files.

### UI Components
- **config-menu**: Dropdown menu in the top nav bar (📁 icon) with four actions: Upload JSON, Download Current, Download Template, Reset to Demo.
- **upload-dialog**: File upload dialog with drag-and-drop support, JSON validation feedback, and preview of what will be loaded (customer name, # of quotas, # of deployments).
- **customer-banner**: When a customer config is loaded, show a colored banner below the top nav with the customer name and "Loaded from JSON" indicator.

### Page Refactoring
- **refactor-dashboard**: Replace hardcoded `DEMO_QUOTAS` with `useCustomerDataStore` data.
- **refactor-quotas**: Replace hardcoded quota array with store data.
- **refactor-deployments**: Replace hardcoded deployments with store data.
- **refactor-analytics**: Replace hardcoded trend data with store data; show placeholder when no trends available.
- **refactor-regions**: Replace hardcoded region data with store data; auto-derive from quotas when `regions[]` is not provided.

### Template
- **json-template**: A complete example JSON template file using "Contoso" as a fake customer with minimal sample data (2-3 quotas, 2 deployments) to show the structure without overwhelming. Downloadable from the config menu.

