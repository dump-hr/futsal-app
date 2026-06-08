import { TournamentContext } from 'context/TournamentContext';
import { useContext } from 'react';

const useTournamentContext = () => {
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

export default useTournamentContext;
