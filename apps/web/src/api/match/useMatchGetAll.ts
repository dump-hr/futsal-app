import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { MatchDto } from '@futsal-app/types';

const getMatches = (tournamentId: number) => {
  return api.get<never, MatchDto[]>(`/match?tournamentId=${tournamentId}`);
};

export const useMatchGetAll = (tournamentId: number) => {
  return useQuery({
    queryFn: () => getMatches(tournamentId),
    queryKey: ['matches', tournamentId],
  });
};
