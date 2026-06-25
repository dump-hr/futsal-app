import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';

const getTeams = (tournamentId: number) => {
  return api.get<never, TeamDto[]>('/team', {
    params: { tournamentId },
  });
};

export const useTeamsGet = (tournamentId: number) => {
  return useQuery({
    queryFn: () => getTeams(tournamentId),
    queryKey: ['teams', tournamentId],
    enabled: !!tournamentId,
  });
};
