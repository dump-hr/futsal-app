import { FC, PropsWithChildren } from 'react';
import { TournamentContext } from './TournamentContext';
import { useTournamentsGet } from '@api/tournament';

export const TournamentProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useTournamentsGet();

  if (!data || data.length === 0) {
    throw new Error('Nema dostupnih turnira');
  }

  const parseMonthYear = (s: string) => {
    const [m, y] = s.split('/').map(Number);
    return new Date(y, m - 1).getTime();
  };

  const tournamentId = data
    .filter((t) => !t.isDeleted)
    .sort((a, b) => parseMonthYear(b.date) - parseMonthYear(a.date))[0].id;

  return (
    <TournamentContext.Provider value={{ tournamentId }}>
      {children}
    </TournamentContext.Provider>
  );
};
