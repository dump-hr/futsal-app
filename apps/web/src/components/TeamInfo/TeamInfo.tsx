import ButtonSmall from '@components/ButtonSmall';
import { TrashCanGray, PencilGray } from '@assets/icons';
import c from './TeamInfo.module.scss';

type TeamInfoProps = {
  teamName: string;
  teamLogoUrl: string;
  teamScore: number;
  teamGroup: string;
  numberOfPlayers: number;
  numberOfMatchesPlayed: number;
  onDelete?: () => void;
  onEdit?: () => void;
  onClick?: () => void;
};

export const TeamInfo: React.FC<TeamInfoProps> = ({
  teamName,
  teamLogoUrl,
  teamScore,
  teamGroup,
  numberOfPlayers,
  numberOfMatchesPlayed,
  onDelete,
  onEdit,
  onClick,
}) => {
  return (
    <div className={c.team} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className={c.teamInfo}>
        <img src={teamLogoUrl} alt={teamName} className={c.teamLogo} />
        <span className={c.teamName}>{teamName}</span>
      </div>
      <div className={c.teamStatsWrapper}>
        <div className={c.teamStats}>
          <span className={c.teamStat}>{teamScore}</span>
          <span className={c.teamStat}>Skupina {teamGroup}</span>
          <span className={c.teamStat}>{numberOfPlayers} igrača</span>
          <span className={c.teamStat}>{numberOfMatchesPlayed} utakmice</span>
        </div>
        <div className={c.teamActions} onClick={(e) => e.stopPropagation()}>
          <ButtonSmall iconSrc={TrashCanGray} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={PencilGray} hasBorder onClick={onEdit} />
        </div>
      </div>
    </div>
  );
};
