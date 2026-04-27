import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './msalConfig';
import { useCallback } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const demoMode = useAppStore((s) => s.demoMode);
  
  const activeAccount = instance.getActiveAccount();

  const login = useCallback(async () => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, [instance]);

  const logout = useCallback(async () => {
    const { setDemoMode } = useAppStore.getState();
    if (demoMode) {
      setDemoMode(false);
      return;
    }
    try {
      await instance.logoutPopup();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [instance, demoMode]);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (demoMode) return null;
    if (!activeAccount) return null;
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: activeAccount,
      });
      return response.accessToken;
    } catch (error) {
      try {
        const response = await instance.acquireTokenPopup(loginRequest);
        return response.accessToken;
      } catch (popupError) {
        console.error('Token acquisition failed:', popupError);
        return null;
      }
    }
  }, [instance, activeAccount, demoMode]);

  // Demo mode user
  if (demoMode) {
    return {
      isAuthenticated: true,
      user: {
        name: 'Demo User',
        email: 'demo@contoso.com',
        tenantId: '00000000-0000-0000-0000-000000000000',
      },
      accounts: [],
      login,
      logout,
      getAccessToken,
    };
  }

  return {
    isAuthenticated,
    user: activeAccount ? {
      name: activeAccount.name || '',
      email: activeAccount.username || '',
      tenantId: activeAccount.tenantId || '',
    } : null,
    accounts,
    login,
    logout,
    getAccessToken,
  };
}
