import { TournamentContext } from '@context/index';
import { useContext } from 'react';

export const useTournamentContext = () => {
  const context = useContext(TournamentContext);

  if (!context) {
    throw new Error(
      'useTournamentContext mora biti korišten unutar TournamentProvider-a',
    );
  }
  if (context.tournamentId == null) {
    throw new Error('Nema aktivnog turnira');
  }

  return context.tournamentId;
};
