import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../base';
import { PlayerDto } from '@futsal-app/types';

const getPlayersByTeam = (teamId: number) => {
  return api.get<never, PlayerDto[]>(`/player/by-team/${teamId}`);
};

export const usePlayerSearch = (teamId: number, query: string) => {
  const { data: players = [], ...rest } = useQuery({
    queryFn: () => getPlayersByTeam(teamId),
    queryKey: ['playersByTeam', teamId],
  });

  const filtered = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return players.filter(
      (p) =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q),
    );
  }, [players, query]);

  return { data: filtered, ...rest };
};
