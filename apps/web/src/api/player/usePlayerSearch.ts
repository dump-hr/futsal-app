import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { PlayerDto } from '@futsal-app/types';

const playerSearch = (teamId: number, query: string) => {
  return api.get<never, PlayerDto[]>(
    `/player/by-team/${teamId}?q=${encodeURIComponent(query)}`,
  );
};

export const usePlayerSearch = (teamId: number, query: string) => {
  return useQuery({
    queryFn: () => playerSearch(teamId, query),
    queryKey: ['playerSearch', teamId, query],
    enabled: query.length > 0,
  });
};
