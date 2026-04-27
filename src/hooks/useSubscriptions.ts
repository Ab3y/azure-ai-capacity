import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/auth/useAuth';
import { listSubscriptions } from '@/services/azureClient';
import type { AzureSubscription } from '@/types/azure';

export function useSubscriptions() {
  const { getAccessToken, isAuthenticated } = useAuth();

  return useQuery<AzureSubscription[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const token = await getAccessToken();
      if (!token) throw new Error('Not authenticated');
      return listSubscriptions(token);
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: 2,
  });
}
