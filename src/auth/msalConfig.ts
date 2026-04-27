import type { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

const STORAGE_KEY = 'azure-ai-capacity-auth-config';

export interface AuthConfig {
  clientId: string;
  tenantId: string;
}

export function getSavedAuthConfig(): AuthConfig | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as AuthConfig;
      if (parsed.clientId && parsed.clientId !== 'YOUR_CLIENT_ID') return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

export function saveAuthConfig(config: AuthConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function clearAuthConfig() {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasValidAuthConfig(): boolean {
  return getSavedAuthConfig() !== null;
}

export function buildMsalConfig(config?: AuthConfig | null): Configuration {
  const clientId = config?.clientId || import.meta.env.VITE_AZURE_CLIENT_ID || 'placeholder-client-id';
  const tenantId = config?.tenantId || import.meta.env.VITE_AZURE_TENANT_ID || 'common';

  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      cacheLocation: 'sessionStorage',
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) return;
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              break;
            case LogLevel.Warning:
              console.warn(message);
              break;
          }
        },
        logLevel: LogLevel.Warning,
      },
    },
  };
}

export const msalConfig = buildMsalConfig(getSavedAuthConfig());

export const loginRequest = {
  scopes: ['https://management.azure.com/.default'],
};

export const armScopes = {
  scopes: ['https://management.azure.com/.default'],
};
