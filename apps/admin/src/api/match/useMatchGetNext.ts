import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getNextMatch = () => {
  return api.get<never, MatchDto | null>('/match/next');
};

export const useMatchGetNext = () => {
  return useQuery({
    queryFn: getNextMatch,
    queryKey: ['match', 'next'],
  });
};
