import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { TournamentDto } from '@futsal-app/types';

const tournamentGet = (id: number) => {
  return api.get<never, TournamentDto>(`/tournament/${id}`);
};

export const useTournamentGet = (id: number) => {
  return useQuery({
    queryFn: () => tournamentGet(id),
    queryKey: ['tournaments', id],
    enabled: !!id,
  });
};
