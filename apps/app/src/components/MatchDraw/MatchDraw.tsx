import { useMemo } from 'react';
import { MatchType } from '@futsal-app/types';
import { useMatchGetAll } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { Bracket, buildBracketRounds } from '@components/index';
import c from './MatchDraw.module.scss';

export const MatchDraw = () => {
  const tournamentId = useTournamentContext();
  const { data: matches, isLoading, isError } = useMatchGetAll(tournamentId);

  const rounds = useMemo(
    () =>
      buildBracketRounds(
        (matches ?? []).filter((match) => match.matchType !== MatchType.group),
      ),
    [matches],
  );

  if (isLoading) return <p className={c.message}>Učitavanje…</p>;
  if (isError)
    return <p className={c.message}>Greška pri učitavanju ždrijeba</p>;
  if (rounds.length === 0)
    return <p className={c.message}>Ždrijeb još nije održan.</p>;

  return <Bracket rounds={rounds} />;
};
