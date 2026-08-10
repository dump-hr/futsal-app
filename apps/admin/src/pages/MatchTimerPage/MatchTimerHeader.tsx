import type { CSSProperties } from 'react';
import type { TeamDto } from '@futsal-app/types';
import { TeamLogo } from '@components/index';
import { useDominantLogoColor } from '@hooks/index';
import c from './MatchTimerPage.module.scss';

type MatchTimerHeaderProps = {
  homeTeam: TeamDto | null | undefined;
  awayTeam: TeamDto | null | undefined;
};

const TeamSlot: React.FC<{ team: TeamDto | null | undefined }> = ({ team }) => (
  <div className={c.headerTeam}>
    <TeamLogo
      name={team?.name ?? 'TBD'}
      logoUrl={team?.logoUrl}
      className={c.headerLogo}
    />
    <span className={c.headerTeamName}>{team?.name ?? 'TBD'}</span>
  </div>
);

export const MatchTimerHeader: React.FC<MatchTimerHeaderProps> = ({
  homeTeam,
  awayTeam,
}) => {
  const homeColor = useDominantLogoColor(homeTeam?.logoUrl);
  const awayColor = useDominantLogoColor(awayTeam?.logoUrl);
  const teamColors = {
    '--home-color': homeColor,
    '--away-color': awayColor,
  } as CSSProperties;

  return (
    <div className={c.gradientBand} style={teamColors}>
      <TeamSlot team={homeTeam} />
      <span className={c.headerSeparator}>-</span>
      <TeamSlot team={awayTeam} />
    </div>
  );
};
