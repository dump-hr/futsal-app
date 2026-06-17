import clsx from 'clsx';
import { ButtonSmall } from '@components/index';
import { XBlack } from '@assets/index';
import { BackgroundColor } from '@types';
import { MATCH_TYPE_LABELS } from '@constants/matchTypeLabels';
import { formatMatchDate } from '@helpers/formatMatchDate';
import c from './MatchPanel.module.scss';

type MatchHeaderProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeGoals: number;
  awayGoals: number;
  matchType: string;
  timeOfMatch: Date;
  penaltyHomeGoals?: number;
  penaltyAwayGoals?: number;
  onClose: () => void;
};

export const MatchHeader: React.FC<MatchHeaderProps> = ({
  homeTeamName,
  awayTeamName,
  homeGoals,
  awayGoals,
  matchType,
  timeOfMatch,
  penaltyHomeGoals,
  penaltyAwayGoals,
  onClose,
}) => {
  const isGroup = matchType === 'group';
  const label = MATCH_TYPE_LABELS[matchType] ?? matchType.toUpperCase();

  return (
    <div className={c.header}>
      <div className={c.headerTop}>
        <div
          className={clsx(
            c.matchTypeBadge,
            isGroup ? c.badgeBlue : c.badgeRed,
          )}>
          <span>{label}</span>
        </div>
        <div onClick={onClose}>
          <ButtonSmall
            iconSrc={XBlack}
            backgroundColor={BackgroundColor.White}
          />
        </div>
      </div>

      <div className={c.matchInfo}>
        <p className={c.matchDate}>{formatMatchDate(timeOfMatch)}</p>
        <p className={c.teamNames}>
          {homeTeamName} <span className={c.dash}>-</span> {awayTeamName}
        </p>
        <p className={c.score}>
          <span className={c.scoreNumber}>{homeGoals}</span>
          <span className={c.scoreDash}>-</span>
          <span className={c.scoreNumber}>{awayGoals}</span>
        </p>
        {penaltyHomeGoals != null && penaltyAwayGoals != null && (
          <p className={c.penaltyScore}>
            ({penaltyHomeGoals} - {penaltyAwayGoals})
          </p>
        )}
      </div>
    </div>
  );
};
