import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { PlayerDto } from '@futsal-app/types';

const playerSearch = (teamId: number, query: string) => {
  return api.get<never, PlayerDto[]>(
    `/player/search/${teamId}?q=${encodeURIComponent(query)}`,
  );
};

export const usePlayerSearch = (
  teamId: number,
  query: string,
  enabled = true,
) => {
  return useQuery({
    queryFn: () => playerSearch(teamId, query),
    queryKey: ['playerSearch', teamId, query],
    enabled: enabled && query.length > 0,
  });
};
