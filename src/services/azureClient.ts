const ARM_BASE = 'https://management.azure.com';
const API_VERSION_COGNITIVE = '2024-10-01';
const API_VERSION_SUBSCRIPTIONS = '2022-12-01';

interface FetchOptions {
  method?: string;
  body?: unknown;
}

async function armFetch<T>(
  token: string,
  path: string,
  apiVersion: string,
  options: FetchOptions = {}
): Promise<T> {
  const separator = path.includes('?') ? '&' : '?';
  const url = `${ARM_BASE}${path}${separator}api-version=${apiVersion}`;

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 429) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '10', 10);
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return armFetch<T>(token, path, apiVersion, options);
  }

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`ARM API error ${response.status}: ${errorBody}`);
  }

  return response.json();
}

export async function listSubscriptions(token: string) {
  const result = await armFetch<{ value: Array<{ subscriptionId: string; displayName: string; state: string; tenantId: string }> }>(
    token,
    '/subscriptions',
    API_VERSION_SUBSCRIPTIONS
  );
  return result.value.filter((s) => s.state === 'Enabled');
}

export async function listCognitiveAccounts(token: string, subscriptionId: string) {
  const result = await armFetch<{ value: Array<Record<string, unknown>> }>(
    token,
    `/subscriptions/${subscriptionId}/providers/Microsoft.CognitiveServices/accounts`,
    API_VERSION_COGNITIVE
  );
  return result.value;
}

export async function listDeployments(token: string, subscriptionId: string, resourceGroup: string, accountName: string) {
  const result = await armFetch<{ value: Array<Record<string, unknown>> }>(
    token,
    `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.CognitiveServices/accounts/${accountName}/deployments`,
    API_VERSION_COGNITIVE
  );
  return result.value;
}

export async function getUsages(token: string, subscriptionId: string, location: string) {
  const result = await armFetch<{ value: Array<{ name: { value: string; localizedValue: string }; currentValue: number; limit: number; unit: string }> }>(
    token,
    `/subscriptions/${subscriptionId}/providers/Microsoft.CognitiveServices/locations/${location}/usages`,
    API_VERSION_COGNITIVE
  );
  return result.value;
}

export async function getAccountUsages(token: string, resourceId: string) {
  const result = await armFetch<{ value: Array<{ name: { value: string; localizedValue: string }; currentValue: number; limit: number; unit: string }> }>(
    token,
    `${resourceId}/usages`,
    API_VERSION_COGNITIVE
  );
  return result.value;
}
