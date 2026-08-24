import { FC, PropsWithChildren, useMemo, useState } from 'react';
import { TournamentContext } from './TournamentContext';
import { useTournamentsGet } from '@api/index';

const STORAGE_KEY = 'selectedTournamentId';

export const TournamentProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading } = useTournamentsGet();

  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Number(stored) : null;
  });

  const tournament = useMemo(() => {
    if (!data?.length) return null;
    return data.find((t) => t.id === selectedId) ?? data[0];
  }, [data, selectedId]);

  const tournamentId = tournament?.id ?? null;

  const selectTournament = (id: number) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  };

  return (
    <TournamentContext.Provider
      value={{ tournament, tournamentId, isLoading, selectTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};
