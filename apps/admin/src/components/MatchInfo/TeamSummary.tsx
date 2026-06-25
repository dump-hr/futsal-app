import clsx from 'clsx';
import { TeamLogo } from '@components/index';
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
      <TeamLogo
        name={team.teamName}
        logoUrl={team.logoUrl}
        className={c.teamLogo}
      />
    </div>
  );
};
