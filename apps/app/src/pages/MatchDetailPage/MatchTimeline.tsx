import clsx from 'clsx';
import { EventType, MatchEventDto } from '@futsal-app/types';
import { EventCard, type EventCardType } from '@components/index';
import c from './MatchTimeline.module.scss';

const TIMELINE_EVENT_TYPES: ReadonlySet<string> = new Set([
  EventType.goal,
  EventType.ownGoal,
  EventType.penaltyGoal,
  EventType.penaltyMiss,
  EventType.yellowCard,
  EventType.redCard,
  EventType.injury,
]);

type MatchTimelineProps = {
  events: MatchEventDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const MatchTimeline = ({
  events,
  isLoading,
  isError,
}: MatchTimelineProps) => {
  if (isLoading) return <p className={c.message}>Učitavanje…</p>;
  if (isError)
    return <p className={c.message}>Greška pri učitavanju događaja</p>;

  const timelineEvents = (events ?? [])
    .filter((event) => TIMELINE_EVENT_TYPES.has(event.eventType))
    .sort((a, b) => a.minute - b.minute || a.id - b.id);

  if (timelineEvents.length === 0)
    return <p className={c.message}>Nema događaja</p>;

  return (
    <div className={c.timeline}>
      {timelineEvents.map((event) => (
        <div
          key={event.id}
          className={clsx(
            c.event,
            event.isForHomeTeam ? c.eventHome : c.eventAway,
          )}>
          <EventCard
            playerName={
              event.player
                ? `${event.player.firstName} ${event.player.lastName}`
                : ''
            }
            eventType={event.eventType as EventCardType}
            minute={event.minute}
            side={event.isForHomeTeam ? 'left' : 'right'}
          />
        </div>
      ))}
    </div>
  );
};
