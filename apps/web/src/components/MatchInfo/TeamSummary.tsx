import clsx from 'clsx';
import { type TeamInfo } from './types';
import c from './MatchInfo.module.scss';

type TeamInfoProps = {
  team: TeamInfo;
  align: 'left' | 'right';
};

export const TeamSummary: React.FC<TeamInfoProps> = ({ team, align }) => {
  return (
    <div className={clsx(c.team, c[align])}>
      <span className={c.teamName}>{team.teamName}</span>
      {team.logoUrl ? (
        <img src={team.logoUrl} className={c.teamLogo} alt={team.teamName} />
      ) : (
        <div className={c.teamLogoFallback} aria-label={team.teamName}>
          {team.teamName.charAt(0)}
        </div>
      )}
    </div>
  );
};
