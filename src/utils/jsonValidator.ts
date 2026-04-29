export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  summary: {
    customerName: string;
    quotaCount: number;
    deploymentCount: number;
    trendCount: number;
    regionCount: number;
  } | null;
}

export function validateCustomerJSON(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['File must contain a valid JSON object'], warnings: [], summary: null };
  }

  const obj = data as Record<string, unknown>;

  // Check meta
  if (!obj.meta || typeof obj.meta !== 'object') {
    errors.push('Missing required "meta" section');
  } else {
    const meta = obj.meta as Record<string, unknown>;
    if (!meta.customerName || typeof meta.customerName !== 'string') {
      errors.push('meta.customerName is required and must be a string');
    }
  }

  // Check quotas
  if (!obj.quotas || !Array.isArray(obj.quotas)) {
    errors.push('Missing required "quotas" array');
  } else if (obj.quotas.length === 0) {
    errors.push('"quotas" array must have at least one entry');
  } else {
    const requiredQuotaFields = ['model', 'family', 'type', 'region', 'limit', 'used', 'unit'];
    for (let i = 0; i < obj.quotas.length; i++) {
      const q = obj.quotas[i] as Record<string, unknown>;
      for (const field of requiredQuotaFields) {
        if (q[field] === undefined || q[field] === null) {
          errors.push(`quotas[${i}] missing required field "${field}"`);
        }
      }
      if (typeof q.limit === 'number' && typeof q.used === 'number' && q.used > q.limit) {
        warnings.push(`quotas[${i}] "${q.model}": usage (${q.used}) exceeds limit (${q.limit})`);
      }
    }
  }

  // Check deployments (optional)
  if (obj.deployments !== undefined) {
    if (!Array.isArray(obj.deployments)) {
      errors.push('"deployments" must be an array');
    } else {
      const requiredDeployFields = ['name', 'account', 'model', 'version', 'sku', 'capacity', 'region', 'state', 'created'];
      for (let i = 0; i < obj.deployments.length; i++) {
        const d = obj.deployments[i] as Record<string, unknown>;
        for (const field of requiredDeployFields) {
          if (d[field] === undefined || d[field] === null) {
            warnings.push(`deployments[${i}] missing field "${field}"`);
          }
        }
      }
    }
  } else {
    warnings.push('"deployments" not provided — Deployments page will show empty state');
  }

  // Check trends (optional)
  if (obj.trends !== undefined && !Array.isArray(obj.trends)) {
    errors.push('"trends" must be an array');
  } else if (!obj.trends || (obj.trends as unknown[]).length === 0) {
    warnings.push('"trends" not provided — Analytics charts will use placeholder');
  }

  // Check regions (optional)
  if (obj.regions !== undefined && !Array.isArray(obj.regions)) {
    errors.push('"regions" must be an array');
  } else if (!obj.regions || (obj.regions as unknown[]).length === 0) {
    warnings.push('"regions" not provided — will be auto-derived from quota data');
  }

  const valid = errors.length === 0;
  const meta = obj.meta as Record<string, unknown> | undefined;
  const summary = valid ? {
    customerName: (meta?.customerName as string) || 'Unknown',
    quotaCount: Array.isArray(obj.quotas) ? obj.quotas.length : 0,
    deploymentCount: Array.isArray(obj.deployments) ? obj.deployments.length : 0,
    trendCount: Array.isArray(obj.trends) ? obj.trends.length : 0,
    regionCount: Array.isArray(obj.regions) ? obj.regions.length : 0,
  } : null;

  return { valid, errors, warnings, summary };
}
