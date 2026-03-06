import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchEventDto } from '@futsal-app/types';

const getMatchEvents = (matchId: number) => {
  return api.get<never, MatchEventDto[]>(`/match-event/match/${matchId}`);
};

export const useMatchEvents = (matchId: number) => {
  return useQuery({
    queryFn: () => getMatchEvents(matchId),
    queryKey: ['matchEvents', matchId],
  });
};
