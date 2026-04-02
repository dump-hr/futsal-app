import ButtonSmall from '@components/ButtonSmall';
import c from './TeamInfo.module.scss';
import trashIconUrl from '../../assets/icons/trash-can-gray.svg';
import editIconUrl from '../../assets/icons/pencil-gray.svg';

type TeamInfoProps = {
  teamName: string;
  teamLogoUrl: string;
  teamScore: number;
  teamGroup: string;
  numberOfPlayers: number;
  numberOfMatchesPlayed: number;
  onDelete?: () => void;
};

export const TeamInfo: React.FC<TeamInfoProps> = ({
  teamName,
  teamLogoUrl,
  teamScore,
  teamGroup,
  numberOfPlayers,
  numberOfMatchesPlayed,
  onDelete,
}) => {
  return (
    <div className={c.team}>
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
        <div className={c.teamActions}>
          <ButtonSmall iconSrc={trashIconUrl} hasBorder onClick={onDelete} />
          <ButtonSmall iconSrc={editIconUrl} hasBorder />
        </div>
      </div>
    </div>
  );
};
