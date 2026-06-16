import { EventType, type MatchEventDto } from '@futsal-app/types';
import { EventRow } from './EventRow';
import { REGULATION_EVENTS, SHOOTOUT_EVENTS } from './constants';
import c from './MatchTimerPage.module.scss';

type EventsColumnsProps = {
  events: MatchEventDto[];
  mode: 'regulation' | 'shootout';
};

export const EventsColumns: React.FC<EventsColumnsProps> = ({ events, mode }) => {
  const allowedTypes =
    mode === 'shootout' ? SHOOTOUT_EVENTS : REGULATION_EVENTS;
  const filtered = events.filter((e) =>
    allowedTypes.includes(e.eventType as EventType),
  );
  const homeEvents = filtered.filter((e) => e.isForHomeTeam);
  const awayEvents = filtered.filter((e) => !e.isForHomeTeam);
  const showMinute = mode === 'regulation';

  return (
    <div className={c.eventsColumns}>
      <div className={c.eventColumn}>
        {homeEvents.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            side='left'
            showMinute={showMinute}
          />
        ))}
      </div>
      <div className={c.eventColumn}>
        {awayEvents.map((event) => (
          <EventRow
            key={event.id}
            event={event}
            side='right'
            showMinute={showMinute}
          />
        ))}
      </div>
    </div>
  );
};
