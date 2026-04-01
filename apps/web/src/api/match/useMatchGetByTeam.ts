import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchListDto } from '@futsal-app/types';

const getMatchesByTeam = (teamId: number) => {
  return api.get<never, MatchListDto[]>(`/match/team/${teamId}`);
};

export const useMatchGetByTeam = (teamId: number) => {
  return useQuery({
    queryFn: () => getMatchesByTeam(teamId),
    queryKey: ['matches', 'team', teamId],
  });
};
