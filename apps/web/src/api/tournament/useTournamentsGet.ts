import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { TournamentDto } from '@futsal-app/types';

const getTournaments = () => {
  return api.get<never, TournamentDto[]>('/tournament');
};

export const useTournamentsGet = () => {
  return useQuery({
    queryFn: getTournaments,
    queryKey: ['tournaments'],
  });
};
