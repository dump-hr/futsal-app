import { createContext } from 'react';

type TournamentContextValue = {
  tournamentId: number | null;
  isLoading: boolean;
};

export const TournamentContext = createContext<
  TournamentContextValue | undefined
>(undefined);
