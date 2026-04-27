import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { buildMsalConfig, getSavedAuthConfig } from './msalConfig';
import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';

let msalInstance = new PublicClientApplication(buildMsalConfig(getSavedAuthConfig()));

interface AuthContextValue {
  reinitialize: (clientId: string, tenantId: string) => Promise<void>;
}

const AuthReinitContext = createContext<AuthContextValue>({ reinitialize: async () => {} });
export const useAuthReinit = () => useContext(AuthReinitContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [, setVersion] = useState(0);

  const initMsal = useCallback(async () => {
    try {
      await msalInstance.initialize();
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        msalInstance.setActiveAccount(accounts[0]);
      }
      msalInstance.addEventCallback((event) => {
        if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
          const payload = event.payload as { account: { username: string } };
          const account = payload.account;
          if (account) {
            const found = msalInstance.getAllAccounts().find(a => a.username === account.username);
            if (found) msalInstance.setActiveAccount(found);
          }
        }
      });
    } catch (err) {
      console.warn('MSAL initialization:', err);
    }
    setReady(true);
  }, []);

  useEffect(() => { initMsal(); }, [initMsal]);

  const reinitialize = useCallback(async (clientId: string, tenantId: string) => {
    setReady(false);
    msalInstance = new PublicClientApplication(buildMsalConfig({ clientId, tenantId }));
    await initMsal();
    setVersion(v => v + 1);
  }, [initMsal]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))]">
        <div className="animate-pulse text-[hsl(var(--muted-foreground))]">Loading...</div>
      </div>
    );
  }

  return (
    <AuthReinitContext.Provider value={{ reinitialize }}>
      <MsalProvider instance={msalInstance}>{children}</MsalProvider>
    </AuthReinitContext.Provider>
  );
}

export { msalInstance };
