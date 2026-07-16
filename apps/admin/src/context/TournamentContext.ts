import { createContext } from 'react';

type TournamentContextValue = {
  tournamentId: number | null;
  isLoading: boolean;
  selectTournament: (id: number) => void;
};

export const TournamentContext = createContext<
  TournamentContextValue | undefined
>(undefined);
