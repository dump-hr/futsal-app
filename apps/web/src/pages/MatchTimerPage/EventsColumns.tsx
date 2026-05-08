import clsx from 'clsx';
import { EventType, type MatchEventDto } from '@futsal-app/types';
import { EVENT_ICON, REGULATION_EVENTS, SHOOTOUT_EVENTS } from './constants';
import c from './MatchTimerPage.module.scss';

type EventsColumnsProps = {
  events: MatchEventDto[];
  mode: 'regulation' | 'shootout';
};

const playerLabel = (event: MatchEventDto): string => {
  if (!event.player) return 'Nepoznat netko';
  return `${event.player.firstName} ${event.player.lastName}`;
};

const EventsColumns: React.FC<EventsColumnsProps> = ({ events, mode }) => {
  const allowedTypes =
    mode === 'shootout' ? SHOOTOUT_EVENTS : REGULATION_EVENTS;
  const filtered = events.filter((e) =>
    allowedTypes.includes(e.eventType as EventType),
  );

  const homeEvents = filtered.filter((e) => e.isForHomeTeam);
  const awayEvents = filtered.filter((e) => !e.isForHomeTeam);

  const renderRow = (event: MatchEventDto, side: 'left' | 'right') => {
    const icon = EVENT_ICON[event.eventType as EventType];
    const isLeft = side === 'left';
    return (
      <div
        key={event.id}
        className={clsx(c.eventRow, isLeft ? c.eventLeft : c.eventRight)}>
        {!isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
        <span className={c.eventText}>
          {mode === 'regulation' && (
            <span className={c.eventMinute}>{event.minute}&apos; </span>
          )}
          {playerLabel(event)}
        </span>
        {isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
      </div>
    );
  };

  return (
    <div className={c.eventsColumns}>
      <div className={c.eventColumn}>
        {homeEvents.map((event) => renderRow(event, 'left'))}
      </div>
      <div className={c.eventColumn}>
        {awayEvents.map((event) => renderRow(event, 'right'))}
      </div>
    </div>
  );
};

export default EventsColumns;
