import clsx from 'clsx';
import { MatchDto } from '@futsal-app/types';
import { getMatchCardLargeView } from './utils';
import c from './MatchCardLarge.module.scss';

export type MatchCardLargeProps = {
  match: MatchDto;
  elapsedMinutes?: number;
  className?: string;
};

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
};

const TeamLogo: React.FC<TeamLogoProps> = ({ name, logoUrl }) =>
  logoUrl ? (
    <img className={c.logo} src={logoUrl} alt='' />
  ) : (
    <span className={clsx(c.logo, c.logoFallback)} aria-hidden>
      {name.charAt(0)}
    </span>
  );

export const MatchCardLarge: React.FC<MatchCardLargeProps> = ({
  match,
  elapsedMinutes,
  className,
}) => {
  const {
    isLive,
    homeName,
    awayName,
    homeLogo,
    awayLogo,
    score,
    metaLabel,
    dateLabel,
    startTime,
    liveLabel,
  } = getMatchCardLargeView(match, elapsedMinutes);

  return (
    <article className={clsx(c.card, className)}>
      <header className={c.header}>
        <span className={c.stage}>{metaLabel}</span>
        {isLive ? (
          <span className={c.live}>{liveLabel}</span>
        ) : (
          <>
            <span className={clsx(c.date, c.dateMobile)}>{startTime}h</span>
            <span className={clsx(c.date, c.dateDesktop)}>{dateLabel}</span>
          </>
        )}
      </header>

      <div className={c.teams}>
        <div className={c.team}>
          <TeamLogo name={homeName} logoUrl={homeLogo} />
          <span className={c.teamName}>{homeName}</span>
        </div>

        <span className={c.score}>{score}</span>

        <div className={c.team}>
          <TeamLogo name={awayName} logoUrl={awayLogo} />
          <span className={c.teamName}>{awayName}</span>
        </div>
      </div>
    </article>
  );
};
