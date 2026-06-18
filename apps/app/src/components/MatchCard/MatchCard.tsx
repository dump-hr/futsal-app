import clsx from 'clsx';
import { MatchDto } from '@futsal-app/types';
import { LiveRed } from '@assets/index';
import { MATCH_STATUS } from '@constants/index';
import {
  formatMatchDateLong,
  formatMatchTime,
  getMatchMetaLabel,
  getMatchStatus,
} from '@helpers/index';
import c from './MatchCard.module.scss';

export type MatchCardProps = {
  match: MatchDto;
  elapsedMinutes?: number;
  className?: string;
};

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
  className: string;
};

const TeamLogo: React.FC<TeamLogoProps> = ({ name, logoUrl, className }) =>
  logoUrl ? (
    <img className={className} src={logoUrl} alt='' />
  ) : (
    <span className={clsx(className, c.logoFallback)} aria-hidden>
      {name.charAt(0)}
    </span>
  );

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  elapsedMinutes,
  className,
}) => {
  const status = getMatchStatus(match);
  const isLive = status === MATCH_STATUS.LIVE;
  const isUpcoming = status === MATCH_STATUS.UPCOMING;

  const homeName = match.homeTeam?.name ?? 'TBD';
  const awayName = match.awayTeam?.name ?? 'TBD';
  const homeLogo = match.homeTeam?.logoUrl;
  const awayLogo = match.awayTeam?.logoUrl;

  const score = isUpcoming ? null : `${match.homeGoals} - ${match.awayGoals}`;
  const metaLabel = getMatchMetaLabel(match);
  const dateLabel = formatMatchDateLong(match.timeOfMatch);
  const startTime = formatMatchTime(match.timeOfMatch);
  const liveLabel = elapsedMinutes != null ? `${elapsedMinutes}'` : '';

  return (
    <article className={clsx(c.card, className)}>
      {/* Mobile version */}
      <div className={c.mobile}>
        <div className={c.summary}>
          <span className={clsx(c.summaryLabel, isLive && c.summaryLabelLive)}>
            {isLive ? liveLabel : metaLabel}
          </span>
          <span className={c.summaryValue}>
            {isUpcoming ? startTime : score}
          </span>
        </div>

        <span className={c.divider} />

        <div className={clsx(c.teams, isLive && c.teamsLive)}>
          <div className={c.team}>
            <TeamLogo name={homeName} logoUrl={homeLogo} className={c.logo} />
            <span className={c.teamName}>{homeName}</span>
          </div>
          <div className={c.team}>
            <TeamLogo name={awayName} logoUrl={awayLogo} className={c.logo} />
            <span className={c.teamName}>{awayName}</span>
          </div>
        </div>

        {isLive && <img className={c.liveDot} src={LiveRed} alt='' />}
      </div>

      {/* Desktop version */}
      <div className={c.desktop}>
        <div className={c.desktopTeams}>
          <span className={clsx(c.desktopTeamName, c.alignEnd)}>{homeName}</span>
          <TeamLogo
            name={homeName}
            logoUrl={homeLogo}
            className={c.desktopLogo}
          />
          <span className={c.badge}>{score ?? 'VS'}</span>
          <TeamLogo
            name={awayName}
            logoUrl={awayLogo}
            className={c.desktopLogo}
          />
          <span className={c.desktopTeamName}>{awayName}</span>
        </div>

        <div className={c.meta}>
          {isLive ? (
            <span className={c.metaLive}>{liveLabel}</span>
          ) : (
            <>
              <span className={c.metaText}>{dateLabel}</span>
              <span className={c.metaText}>{metaLabel}</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
};
