import { Link } from 'wouter';
import { MatchDto } from '@futsal-app/types';
import { Skeleton, TeamLogo } from '@components/index';
import { routes } from '@routes/index';
import { ArrowLeftWhite } from '@assets/index';
import c from './MatchDetailHeader.module.scss';

type MatchDetailHeaderProps = {
  match: MatchDto | undefined;
  isLoading: boolean;
  stageLabel: string;
  scoreLabel: string;
  shootoutLabel: string;
  timeLabel: string;
  homeLogoUrl: string | null | undefined;
  awayLogoUrl: string | null | undefined;
};

export const MatchDetailHeader = ({
  match,
  isLoading,
  stageLabel,
  scoreLabel,
  shootoutLabel,
  timeLabel,
  homeLogoUrl,
  awayLogoUrl,
}: MatchDetailHeaderProps) => {
  return (
    <header className={c.header}>
      <Link href={routes.MATCHES} className={c.backButton} aria-label='Natrag'>
        <img className={c.backIcon} src={ArrowLeftWhite} alt='' />
      </Link>
      <div className={c.scoreboard}>
        <div className={c.team}>
          {isLoading ? (
            <>
              <Skeleton className={c.teamLogo} />
              <Skeleton className={c.teamNameSkeleton} />
            </>
          ) : (
            <>
              <TeamLogo
                name={match?.homeTeam?.name ?? 'TBD'}
                logoUrl={homeLogoUrl}
                className={c.teamLogo}
              />
              <span className={c.teamName}>
                {match?.homeTeam?.name ?? 'TBD'}
              </span>
            </>
          )}
        </div>
        <div className={c.center}>
          {isLoading ? (
            <>
              <Skeleton className={c.stageSkeleton} />
              <Skeleton className={c.scoreSkeleton} />
              <Skeleton className={c.timeSkeleton} />
            </>
          ) : (
            <>
              {stageLabel && <span className={c.stage}>{stageLabel}</span>}
              <span className={c.score}>{scoreLabel}</span>
              {shootoutLabel && (
                <span className={c.shootout}>{shootoutLabel}</span>
              )}
              {timeLabel && <span className={c.time}>{timeLabel}</span>}
            </>
          )}
        </div>
        <div className={c.team}>
          {isLoading ? (
            <>
              <Skeleton className={c.teamLogo} />
              <Skeleton className={c.teamNameSkeleton} />
            </>
          ) : (
            <>
              <TeamLogo
                name={match?.awayTeam?.name ?? 'TBD'}
                logoUrl={awayLogoUrl}
                className={c.teamLogo}
              />
              <span className={c.teamName}>
                {match?.awayTeam?.name ?? 'TBD'}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
