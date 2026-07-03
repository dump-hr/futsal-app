import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getMatch = (matchId: number) => {
  return api.get<never, MatchDto>(`/match/${matchId}`);
};

export const useMatchGet = (matchId: number | undefined) => {
  return useQuery({
    queryFn: () => getMatch(matchId!),
    queryKey: ['matches', matchId],
    enabled: !!matchId,
  });
};
