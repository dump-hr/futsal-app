import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchTimerStateDto } from '@futsal-app/types';

const getMatchTimer = (matchId: number) => {
  return api.get<never, MatchTimerStateDto>(`/match/${matchId}/timer`);
};

export const useMatchTimerGet = (matchId: number) => {
  return useQuery({
    queryFn: () => getMatchTimer(matchId),
    queryKey: ['matchTimer', matchId],
    enabled: !!matchId,
    staleTime: Infinity,
    retry: false,
  });
};
