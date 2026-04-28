import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ApiAuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  isApiAuthenticated: boolean;

  setAuth: (token: string, username: string, role: string) => void;
  clearAuth: () => void;
}

export const useApiAuthStore = create<ApiAuthState>()(
  persist(
    (set) => ({
      token: null,
      username: null,
      role: null,
      isApiAuthenticated: false,

      setAuth: (token, username, role) => set({ token, username, role, isApiAuthenticated: true }),
      clearAuth: () => set({ token: null, username: null, role: null, isApiAuthenticated: false }),
    }),
    {
      name: 'azure-ai-capacity-api-auth',
    }
  )
);
