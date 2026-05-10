import clsx from 'clsx';
import { EventType, type MatchEventDto } from '@futsal-app/types';
import { EVENT_ICON } from './constants';
import c from './MatchTimerPage.module.scss';

const playerLabel = (event: MatchEventDto): string =>
  event.player
    ? `${event.player.firstName} ${event.player.lastName}`
    : 'Nepoznat netko';

type EventRowProps = {
  event: MatchEventDto;
  side: 'left' | 'right';
  showMinute: boolean;
};

const EventRow: React.FC<EventRowProps> = ({ event, side, showMinute }) => {
  const icon = EVENT_ICON[event.eventType as EventType];
  const isLeft = side === 'left';

  return (
    <div className={clsx(c.eventRow, isLeft ? c.eventLeft : c.eventRight)}>
      {!isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
      <span className={c.eventText}>
        {showMinute && (
          <span className={c.eventMinute}>{event.minute}&apos; </span>
        )}
        {playerLabel(event)}
      </span>
      {isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
    </div>
  );
};

export default EventRow;
