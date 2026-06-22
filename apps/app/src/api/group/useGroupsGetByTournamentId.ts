import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { GroupDto } from '@futsal-app/types';

const groupsGetByTournamentId = (tournamentId: number) => {
  return api.get<never, GroupDto[]>('/group', {
    params: { tournamentId },
  });
};

export const useGroupsGetByTournamentId = (tournamentId: number) => {
  return useQuery({
    queryFn: () => groupsGetByTournamentId(tournamentId),
    queryKey: ['groups', tournamentId],
    enabled: !!tournamentId,
  });
};
