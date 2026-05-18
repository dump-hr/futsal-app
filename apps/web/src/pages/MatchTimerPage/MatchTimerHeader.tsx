import type { TeamDto } from '@futsal-app/types';
import c from './MatchTimerPage.module.scss';

type MatchTimerHeaderProps = {
  homeTeam: TeamDto | null | undefined;
  awayTeam: TeamDto | null | undefined;
};

const TeamSlot: React.FC<{ team: TeamDto | null | undefined }> = ({ team }) => (
  <div className={c.headerTeam}>
    {team?.logoUrl && (
      <div className={c.headerLogo}>
        <img src={team.logoUrl} alt={team?.name ?? ''} />
      </div>
    )}
    <span className={c.headerTeamName}>{team?.name ?? 'TBD'}</span>
  </div>
);

export const MatchTimerHeader: React.FC<MatchTimerHeaderProps> = ({
  homeTeam,
  awayTeam,
}) => {
  return (
    <div className={c.gradientBand}>
      <TeamSlot team={homeTeam} />
      <span className={c.headerSeparator}>-</span>
      <TeamSlot team={awayTeam} />
    </div>
  );
};
