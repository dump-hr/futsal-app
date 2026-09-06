import { createContext } from 'react';
import { TournamentDto } from '@futsal-app/types';

type TournamentContextValue = {
  tournament: TournamentDto | null;
  tournamentId: number | null;
  isLoading: boolean;
  selectTournament: (id: number) => void;
};

export const TournamentContext = createContext<
  TournamentContextValue | undefined
>(undefined);
