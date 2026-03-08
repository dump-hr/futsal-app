import { api } from '@api/base';
import { TournamentDto } from '@futsal-app/types';
import { useQuery } from '@tanstack/react-query';

const getTournamentById = (id: number) => {
  return api.get<never, TournamentDto>(`/tournament/${id}`);
};

export const useTournamentGetById = (id: number) => {
  return useQuery({
    queryFn: () => getTournamentById(id),
    queryKey: ['tournament', id],
  });
};
