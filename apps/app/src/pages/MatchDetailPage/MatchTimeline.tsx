import clsx from 'clsx';
import { EventType, MatchDto, MatchEventDto } from '@futsal-app/types';
import {
  EventCard,
  NoEventsCard,
  type EventCardType,
} from '@components/index';
import { MATCH_STATUS } from '@constants/index';
import { getMatchStatus } from '@helpers/index';
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
  match: MatchDto;
  events: MatchEventDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export const MatchTimeline = ({
  match,
  events,
  isLoading,
  isError,
}: MatchTimelineProps) => {
  if (isLoading) return <p className={c.message}>Učitavanje…</p>;
  if (isError)
    return <p className={c.message}>Greška pri učitavanju događaja</p>;

  if (getMatchStatus(match) === MATCH_STATUS.UPCOMING) {
    return (
      <div className={c.notStarted}>
        <NoEventsCard />
      </div>
    );
  }

  const timelineEvents = (events ?? [])
    .filter((event) => TIMELINE_EVENT_TYPES.has(event.eventType))
    .sort((a, b) => a.minute - b.minute || a.id - b.id);

  if (timelineEvents.length === 0) return null;

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
