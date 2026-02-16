import { type TeamInfo } from '.';
import c from './MatchInfo.module.scss';

type TeamInfoProps = {
  team: TeamInfo;
  align: 'left' | 'right';
};

export const TeamSummary: React.FC<TeamInfoProps> = ({ team, align }) => {
  return (
    <div className={`${c.team} ${c[align]}`}>
      <span className={c.teamName}>{team.teamName}</span>
      <img src={team.logoUrl} className={c.teamLogo} alt={team.teamName} />
    </div>
  );
};
