import { useState } from 'react';
import clsx from 'clsx';
import { EventType, MatchDto, MatchEventDto } from '@futsal-app/types';
import { Button } from '@components/index';
import { GoalWhite } from '@assets/index';
import c from './MatchPlayers.module.scss';

const GOAL_EVENT_TYPES: ReadonlySet<string> = new Set([
  EventType.goal,
  EventType.penaltyGoal,
]);

type MatchPlayersProps = {
  match: MatchDto;
  events: MatchEventDto[] | undefined;
};

export const MatchPlayers = ({ match, events }: MatchPlayersProps) => {
  const [activeSide, setActiveSide] = useState<'home' | 'away'>('home');

  const team = activeSide === 'home' ? match.homeTeam : match.awayTeam;
  const players = [...(team?.players ?? [])].sort((a, b) =>
    a.lastName.localeCompare(b.lastName),
  );

  const countGoals = (playerId: number) =>
    (events ?? []).filter(
      (event) =>
        event.playerId === playerId && GOAL_EVENT_TYPES.has(event.eventType),
    ).length;

  return (
    <div className={c.container}>
      <div className={c.teamToggle}>
        <Button
          variant={activeSide === 'home' ? 'primary' : 'secondary'}
          onClick={() => setActiveSide('home')}>
          {match.homeTeam?.name ?? 'TBD'}
        </Button>
        <Button
          variant={activeSide === 'away' ? 'primary' : 'secondary'}
          onClick={() => setActiveSide('away')}>
          {match.awayTeam?.name ?? 'TBD'}
        </Button>
      </div>

      {players.length === 0 ? (
        <p className={c.message}>Nema igrača</p>
      ) : (
        <div className={c.table}>
          <div className={clsx(c.row, c.headerRow)}>
            <span className={c.playerName}>Ime i Prezime</span>
            <img className={c.statIcon} src={GoalWhite} alt='Golovi' />
          </div>

          {players.map((player) => (
            <div key={player.id} className={c.row}>
              <span className={c.playerName}>
                {player.firstName} {player.lastName}
              </span>
              <span className={c.stat}>{countGoals(player.id)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
