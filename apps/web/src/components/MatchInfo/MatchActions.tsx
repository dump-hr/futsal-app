import c from './MatchInfo.module.scss';
import playIconSvg from '../../assets/icons/play-black.svg';
import trachCanIconSvg from '../../assets/icons/trash-can-gray.svg';
import editIconSvg from '../../assets/icons/pencil-gray.svg';
import doneIconSvg from '../../assets/icons/check-black.svg';
import timerIconSvg from '../../assets/icons/timer-gray.svg';
import { type MatchStatus, MATCH_STATUS } from '.';

type MatchActionsProps = {
  status: MatchStatus;
};

export const MatchActions: React.FC<MatchActionsProps> = ({ status }) => {
  console.log('MatchActions render with status:', status);
  switch (status) {
    case MATCH_STATUS.UPCOMING:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton
            iconUrl={playIconSvg}
            altStyle='iconButtonPlay'
            altText='Play'
          />
          <IconButton iconUrl={trachCanIconSvg} altText='Delete' />
          <IconButton iconUrl={editIconSvg} altText='Edit' />
        </div>
      );
    case MATCH_STATUS.LIVE:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton iconUrl={timerIconSvg} altText='Stopwatch' />
          <div className={c.redDotIndicator}>
            <div className={c.redDotIndicatorInner} />
          </div>
        </div>
      );
    case MATCH_STATUS.FINISHED:
      return (
        <div className={c.matchActionWrapper}>
          <IconButton
            iconUrl={doneIconSvg}
            altStyle='iconButtonDone'
            altText='Done'
          />
          <IconButton iconUrl={trachCanIconSvg} altText='Delete' />
          <IconButton iconUrl={editIconSvg} altText='Edit' />
        </div>
      );
    default:
      return null;
  }
};

type IconButtonProps = {
  iconUrl: string;
  altText: string;
  altStyle?: string;
  onClick?: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({
  iconUrl,
  altText,
  altStyle = '',
  onClick,
}) => {
  return (
    <button className={c.iconButtonWrapper} onClick={onClick}>
      <img
        src={iconUrl}
        alt={altText}
        className={`${c.iconButtonImage} ${c[altStyle]}`}
      />
    </button>
  );
};
