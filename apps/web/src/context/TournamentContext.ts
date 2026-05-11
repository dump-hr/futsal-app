import { createContext } from 'react';

type TournamentContextValue = {
  tournamentId: number | null;
};

export const TournamentContext = createContext<TournamentContextValue | undefined>(undefined);
