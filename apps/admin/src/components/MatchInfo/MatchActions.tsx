import c from './MatchInfo.module.scss';
import {
  PlayBlack,
  TrashCanGray,
  PencilGray,
  CheckBlack,
  TimerGray,
} from '@assets/index';
import { MATCH_STATUS } from './constants';
import type { MatchStatus } from './types';
import { ButtonSmall } from '@components/index';
import { BackgroundColor } from '../../types';

type MatchActionsProps = {
  status: MatchStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
  onTimer?: () => void;
};

export const MatchActions: React.FC<MatchActionsProps> = ({
  status,
  onEdit,
  onDelete,
  onActivate,
  onTimer,
}) => {
  switch (status) {
    case MATCH_STATUS.UPCOMING:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall
            iconSrc={PlayBlack}
            hasBorder
            backgroundColor={BackgroundColor.White}
            onClick={onActivate}
          />
          <ButtonSmall iconSrc={TrashCanGray} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={PencilGray} hasBorder onClick={onEdit} />
        </div>
      );
    case MATCH_STATUS.LIVE:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall iconSrc={TimerGray} hasBorder onClick={onTimer} />
          <div className={c.redDotIndicator}>
            <div className={c.redDotIndicatorInner} />
          </div>
        </div>
      );
    case MATCH_STATUS.FINISHED:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall
            iconSrc={CheckBlack}
            backgroundColor={BackgroundColor.Lime}
          />
          <ButtonSmall iconSrc={TrashCanGray} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={PencilGray} hasBorder onClick={onEdit} />
        </div>
      );
    default:
      return null;
  }
};
