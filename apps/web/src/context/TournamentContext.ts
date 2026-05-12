import { createContext } from 'react';

export const TournamentContext = createContext<{
  tournamentId: number | null;
  isLoading: boolean;
}>({
  tournamentId: null,
  isLoading: false,
});
