import clsx from 'clsx';
import c from './EventCard.module.scss';
import { EVENT_CONFIG, EventCardType } from './eventConfig';

type EventCardProps = {
  playerName: string;
  eventType: EventCardType;
  minute: number;
  side?: 'left' | 'right';
};

export const EventCard: React.FC<EventCardProps> = ({
  playerName,
  eventType,
  minute,
  side = 'left',
}) => {
  const { label, icon } = EVENT_CONFIG[eventType];
  const isRight = side === 'right';

  return (
    <div className={clsx(c.card, isRight && c.cardRight)}>
      <img src={icon} alt='' aria-hidden data-event={eventType} className={c.icon} />
      <p className={c.label}>{label}</p>
      <div className={c.info}>
        <span>{playerName}</span>
        <span>{minute}'</span>
      </div>
    </div>
  );
};
