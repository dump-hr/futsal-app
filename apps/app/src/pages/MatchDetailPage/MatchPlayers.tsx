import { useState } from 'react';
import clsx from 'clsx';
import { EventType, MatchDto, MatchEventDto } from '@futsal-app/types';
import { Button } from '@components/index';
import { CardWhite, GoalWhite } from '@assets/index';
import c from './MatchPlayers.module.scss';

const CARD_EVENT_TYPES: ReadonlySet<string> = new Set([
  EventType.yellowCard,
  EventType.redCard,
]);

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

  const countEvents = (playerId: number, types: ReadonlySet<string>) =>
    (events ?? []).filter(
      (event) => event.playerId === playerId && types.has(event.eventType),
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
            <img className={c.statIcon} src={CardWhite} alt='Kartoni' />
            <img className={c.statIcon} src={GoalWhite} alt='Golovi' />
          </div>

          {players.map((player) => (
            <div key={player.id} className={c.row}>
              <span className={c.playerName}>
                {player.firstName} {player.lastName}
              </span>
              <span className={c.stat}>
                {countEvents(player.id, CARD_EVENT_TYPES)}
              </span>
              <span className={c.stat}>
                {countEvents(player.id, GOAL_EVENT_TYPES)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
