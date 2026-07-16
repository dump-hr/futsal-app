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

  const tournamentId = useMemo(() => {
    if (!data?.length) return null;
    const exists = selectedId != null && data.some((t) => t.id === selectedId);
    return exists ? selectedId : data[0].id;
  }, [data, selectedId]);

  const selectTournament = (id: number) => {
    setSelectedId(id);
    localStorage.setItem(STORAGE_KEY, String(id));
  };

  return (
    <TournamentContext.Provider
      value={{ tournamentId, isLoading, selectTournament }}>
      {children}
    </TournamentContext.Provider>
  );
};
