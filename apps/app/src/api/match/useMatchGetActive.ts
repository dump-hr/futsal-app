import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getActiveMatch = () => {
  return api.get<never, MatchDto | null>('/match/active');
};

export const useMatchGetActive = () => {
  return useQuery({
    queryFn: getActiveMatch,
    queryKey: ['match', 'active'],
  });
};
