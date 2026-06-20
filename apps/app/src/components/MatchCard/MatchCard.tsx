import clsx from 'clsx';
import { MatchDto } from '@futsal-app/types';
import { LiveRed } from '@assets/index';
import { getMatchCardView } from './utils';
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
  const {
    isLive,
    isUpcoming,
    homeName,
    awayName,
    homeLogo,
    awayLogo,
    score,
    metaLabel,
    dateLabel,
    startTime,
    liveLabel,
  } = getMatchCardView(match, elapsedMinutes);

  return (
    <article className={clsx(c.card, className)}>
      <div className={c.summary}>
        <span className={clsx(c.summaryLabel, isLive && c.summaryLabelLive)}>
          {isLive ? liveLabel : metaLabel}
        </span>
        <span className={c.summaryValue}>{isUpcoming ? startTime : score}</span>
      </div>

      <span className={c.divider} />

      <div className={clsx(c.teams, isLive && c.teamsLive)}>
        <div className={clsx(c.team, c.homeTeam)}>
          <TeamLogo name={homeName} logoUrl={homeLogo} className={c.logo} />
          <span className={c.teamName}>{homeName}</span>
        </div>
        <span className={c.badge}>{score ?? 'VS'}</span>
        <div className={c.team}>
          <TeamLogo name={awayName} logoUrl={awayLogo} className={c.logo} />
          <span className={c.teamName}>{awayName}</span>
        </div>
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

      {isLive && <img className={c.liveDot} src={LiveRed} alt='' />}
    </article>
  );
};
