import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { PlayerDto } from '@futsal-app/types';

const getTopScorers = (tournamentId: number, limit: number) => {
  return api.get<never, PlayerDto[]>('/player/top-scorers', {
    params: { tournamentId, limit },
  });
};

export const useTopScorersGet = (tournamentId: number, limit: number) => {
  return useQuery({
    queryFn: () => getTopScorers(tournamentId, limit),
    queryKey: ['topScorers', tournamentId, limit],
    enabled: tournamentId > 0 && limit > 0,
  });
};
