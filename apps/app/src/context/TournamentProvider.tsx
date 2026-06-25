import { FC, PropsWithChildren } from 'react';
import { TournamentContext } from './TournamentContext';
import { useTournamentsGet } from '@api/index';

export const TournamentProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading } = useTournamentsGet();
  const tournamentId = data?.[0]?.id ?? null;

  if (isLoading) return null;

  return (
    <TournamentContext.Provider value={{ tournamentId, isLoading }}>
      {children}
    </TournamentContext.Provider>
  );
};
