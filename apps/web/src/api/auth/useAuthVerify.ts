import { useQuery } from '@tanstack/react-query';
import { api } from '../base';

export const useAuthVerify = (enabled: boolean) => {
  return useQuery({
    queryKey: ['auth', 'verify'],
    queryFn: () => api.get<unknown, { ok: boolean }>('/auth/verify'),
    enabled,
    retry: false,
    staleTime: Infinity,
  });
};
