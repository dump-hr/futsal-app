import { TournamentContext } from '@context/index';
import { useContext } from 'react';

export const useTournamentContext = () => {
  const context = useContext(TournamentContext);

  if (!context) {
    throw new Error(
      'useTournamentContext mora biti korišten unutar TournamentProvider-a',
    );
  }

  return context;
};

export const useTournamentId = () => {
  const { tournamentId } = useTournamentContext();

  if (tournamentId == null) {
    throw new Error('Nema aktivnog turnira');
  }

  return tournamentId;
};
