import clsx from 'clsx';
import { ButtonSmall } from '@components/index';
import { XBlack, LinkBlack } from '@assets/index';
import { BackgroundColor } from '../../types';
import c from './MatchPanel.module.scss';

type MatchHeaderProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeGoals: number;
  awayGoals: number;
  matchType: string;
  timeOfMatch: string;
  penaltyHomeGoals?: number;
  penaltyAwayGoals?: number;
  onClose: () => void;
};

const MATCH_TYPE_LABELS: Record<string, string> = {
  group: 'SKUPINA',
  quarterFinal: 'ČETVRTFINALE',
  semiFinal: 'POLUFINALE',
  final: 'FINALE',
  thirdPlace: 'TREĆE MJESTO',
};

// vidit ocemo ovo prebacit u helper folder ili tako nesto?
const formatMatchDate = (isoString: string): string => {
  const date = new Date(isoString);
  const days = ['NEDJELJA', 'PONEDJELJAK', 'UTORAK', 'SRIJEDA', 'ČETVRTAK', 'PETAK', 'SUBOTA'];
  const day = days[date.getDay()];
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${day}, ${d}/${m} - ${h}:${min}`;
};

const MatchHeader: React.FC<MatchHeaderProps> = ({
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
        <div className={c.headerTopLeft}>
          <div
            className={clsx(c.matchTypeBadge, isGroup ? c.badgeBlue : c.badgeRed)}>
            <span>{label}</span>
          </div>
          <ButtonSmall
            iconSrc={LinkBlack}
            backgroundColor={BackgroundColor.White}
          />
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
        <div className={c.teamNames}>
          <p className={c.teamNameHeader}>{homeTeamName}</p>
          <p className={c.dash}>-</p>
          <p className={c.teamNameHeader}>{awayTeamName}</p>
        </div>
        <div className={c.score}>
          <span className={c.scoreNumber}>{homeGoals}</span>
          <span className={c.scoreDash}>-</span>
          <span className={c.scoreNumber}>{awayGoals}</span>
        </div>
        {penaltyHomeGoals != null && penaltyAwayGoals != null && (
          <p className={c.penaltyScore}>
            ({penaltyHomeGoals} - {penaltyAwayGoals})
          </p>
        )}
      </div>
    </div>
  );
};

export default MatchHeader;
