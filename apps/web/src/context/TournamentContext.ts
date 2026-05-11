import { createContext } from 'react';

export const TournamentContext = createContext<{
  tournamentId: number | null;
}>({
  tournamentId: null,
});
