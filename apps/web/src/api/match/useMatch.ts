import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getMatch = (matchId: number) => {
  return api.get<never, MatchDto>(`/match/${matchId}`);
};

export const useMatch = (matchId: number) => {
  return useQuery({
    queryFn: () => getMatch(matchId),
    queryKey: ['match', matchId],
  });
};
