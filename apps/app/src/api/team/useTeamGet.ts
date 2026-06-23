import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { TeamDto } from '@futsal-app/types';

const getTeam = (id: number) => {
  return api.get<never, TeamDto>(`/team/${id}`);
};

export const useTeamGet = (id: number | undefined) => {
  return useQuery({
    queryFn: () => getTeam(id!),
    queryKey: ['team', id],
    enabled: !!id,
  });
};
