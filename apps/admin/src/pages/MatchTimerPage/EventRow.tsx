import clsx from 'clsx';
import { EventType, type MatchEventDto } from '@futsal-app/types';
import { TrashCanGray } from '@assets/index';
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
  onDelete: () => void;
};

export const EventRow: React.FC<EventRowProps> = ({
  event,
  side,
  showMinute,
  onDelete,
}) => {
  const icon = EVENT_ICON[event.eventType as EventType];
  const isLeft = side === 'left';

  const deleteButton = (
    <button
      type='button'
      aria-label='Obriši događaj'
      className={c.eventDelete}
      onClick={onDelete}>
      <img src={TrashCanGray} alt='' />
    </button>
  );

  return (
    <div className={clsx(c.eventRow, isLeft ? c.eventLeft : c.eventRight)}>
      {isLeft && deleteButton}
      {!isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
      <span className={c.eventText}>
        {showMinute && (
          <span className={c.eventMinute}>{event.minute}&apos; </span>
        )}
        {playerLabel(event)}
      </span>
      {isLeft && icon && <img src={icon} alt='' className={c.eventIcon} />}
      {!isLeft && deleteButton}
    </div>
  );
};
