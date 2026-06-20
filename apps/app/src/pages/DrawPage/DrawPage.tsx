import { MatchType } from '@futsal-app/types';
import { useMatchGetAll } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { DrawRound } from '@components/index';
import c from './DrawPage.module.scss';

export const DrawPage = () => {
  const tournamentId = useTournamentContext();
  const { data: matches, isLoading } = useMatchGetAll(tournamentId);

  if (isLoading) {
    return <div className={c.page}>Učitavanje...</div>;
  }

  const knockoutMatches =
    matches?.filter((m) => m.matchType !== MatchType.group) ?? [];

  return (
    <div className={c.page}>
      <h1 className={c.title}>Ždrijeb</h1>
      <div className={c.list}>
        {knockoutMatches.map((match) => {
          const teamA = {
            name: match.homeTeam?.name ?? 'TBD',
            logoUrl: match.homeTeam?.logoUrl,
          };
          const teamB = {
            name: match.awayTeam?.name ?? 'TBD',
            logoUrl: match.awayTeam?.logoUrl,
          };

          if (match.isActive) {
            return (
              <DrawRound
                key={match.id}
                status='ACTIVE'
                teamA={teamA}
                teamB={teamB}
                teamAScore={match.homeGoals}
                teamBScore={match.awayGoals}
              />
            );
          }

          const date = new Date(match.timeOfMatch);
          return (
            <DrawRound
              key={match.id}
              status='UPCOMING'
              teamA={teamA}
              teamB={teamB}
              matchDate={`${date.getDate()}.${date.getMonth() + 1}.`}
              matchTime={date.toLocaleTimeString('hr', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          );
        })}
      </div>
    </div>
  );
};
