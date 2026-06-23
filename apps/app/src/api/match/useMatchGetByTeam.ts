import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getMatchesByTeam = (teamId: number) => {
  return api.get<never, MatchDto[]>(`/match/team/${teamId}`);
};

export const useMatchGetByTeam = (teamId: number | undefined) => {
  return useQuery({
    queryFn: () => getMatchesByTeam(teamId!),
    queryKey: ['matches', 'team', teamId],
    enabled: !!teamId,
  });
};
