import c from './MatchInfo.module.scss';
import playIconSvg from '../../assets/icons/play-black.svg';
import trashCanIconSvg from '../../assets/icons/trash-can-gray.svg';
import editIconSvg from '../../assets/icons/pencil-gray.svg';
import doneIconSvg from '../../assets/icons/check-black.svg';
import timerIconSvg from '../../assets/icons/timer-gray.svg';
import { type MatchStatus, MATCH_STATUS } from '.';
import ButtonSmall from '@components/ButtonSmall';
import { BackgroundColor } from '../../types';

type MatchActionsProps = {
  status: MatchStatus;
  onEdit?: () => void;
  onDelete?: () => void;
  onActivate?: () => void;
};

export const MatchActions: React.FC<MatchActionsProps> = ({
  status,
  onEdit,
  onDelete,
  onActivate,
}) => {
  switch (status) {
    case MATCH_STATUS.UPCOMING:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall
            iconSrc={playIconSvg}
            hasBorder
            backgroundColor={BackgroundColor.White}
            onClick={onActivate}
          />
          <ButtonSmall iconSrc={trashCanIconSvg} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={editIconSvg} hasBorder onClick={onEdit} />
        </div>
      );
    case MATCH_STATUS.LIVE:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall iconSrc={timerIconSvg} hasBorder />
          <div className={c.redDotIndicator}>
            <div className={c.redDotIndicatorInner} />
          </div>
        </div>
      );
    case MATCH_STATUS.FINISHED:
      return (
        <div className={c.matchActionWrapper}>
          <ButtonSmall
            iconSrc={doneIconSvg}
            backgroundColor={BackgroundColor.Lime}
          />
          <ButtonSmall iconSrc={trashCanIconSvg} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={editIconSvg} hasBorder onClick={onEdit} />
        </div>
      );
    default:
      return null;
  }
};
