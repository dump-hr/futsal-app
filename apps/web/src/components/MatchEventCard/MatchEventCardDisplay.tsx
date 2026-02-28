import clsx from 'clsx';
import { EventType } from '@futsal-app/types';
import { ButtonSmall } from '@components/index';
import { TrashCanGray, PencilGray } from '@assets/index';
import { EVENT_LABELS } from '../../types';
import c from './MatchEventCard.module.scss';

type MatchEventCardDisplayProps = {
  minute?: number;
  playerName?: string;
  eventType?: EventType;
  side: 'left' | 'right';
  isPenaltyShootout: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

const MatchEventCardDisplay: React.FC<MatchEventCardDisplayProps> = ({
  minute,
  playerName,
  eventType,
  side,
  isPenaltyShootout,
  onEdit,
  onDelete,
}) => {
  const isLeft = side === 'left';

  return (
    <div className={clsx(c.card, !isLeft && c.cardRight)}>
      <div className={clsx(c.topRow, !isLeft && c.topRowRight)}>
        <div className={c.actions}>
          <div onClick={onDelete}>
            <ButtonSmall iconSrc={TrashCanGray} hasBorder />
          </div>
          <div onClick={onEdit}>
            <ButtonSmall iconSrc={PencilGray} hasBorder />
          </div>
        </div>
        <p className={isPenaltyShootout ? c.penaltyLabel : c.minute}>
          {isPenaltyShootout ? 'PENAL' : `${minute}'`}
        </p>
      </div>
      <div className={clsx(c.info, !isLeft && c.infoRight)}>
        <p className={c.playerName}>{playerName}</p>
        <p className={c.eventLabel}>
          {eventType ? EVENT_LABELS[eventType].toUpperCase() : ''}
        </p>
      </div>
    </div>
  );
};

export default MatchEventCardDisplay;
