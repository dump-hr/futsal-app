import { api } from '@api/base';
import { TournamentDto } from '@futsal-app/types';
import { useQuery } from '@tanstack/react-query';

const getTournaments = () => {
  return api.get<never, TournamentDto[]>('/tournament');
};

export const useTournamentsGet = () => {
  return useQuery({
    queryFn: () => getTournaments(),
    queryKey: ['tournaments'],
  });
};
