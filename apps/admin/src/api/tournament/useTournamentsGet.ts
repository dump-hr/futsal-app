import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { TournamentDto } from '@futsal-app/types';

const tournamentsGet = () => {
  return api.get<never, TournamentDto[]>('/tournament');
};

export const useTournamentsGet = () => {
  return useQuery({
    queryFn: tournamentsGet,
    queryKey: ['tournaments'],
  });
};
