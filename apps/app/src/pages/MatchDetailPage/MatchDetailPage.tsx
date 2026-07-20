import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'wouter';
import clsx from 'clsx';
import { MatchType } from '@futsal-app/types';
import {
  useMatchGet,
  useMatchEventsGet,
  useMatchEventsLive,
  useMatchTimerLive,
} from '@api/index';
import {
  MatchDraw,
  MatchPlayers,
  MatchStanding,
  MatchTimeline,
  Navbar,
  Skeleton,
  TeamLogo,
} from '@components/index';
import {
  getDominantLogoColor,
  PLACEHOLDER_DOMINANT_COLOR,
  toHex,
} from '@components/Team/utils';
import { getMatchStatus } from '@helpers/index';
import { routes } from '@routes/index';
import { ArrowLeftWhite } from '@assets/index';
import c from './MatchDetailPage.module.scss';
import { NotFoundPage } from '@pages/NotFoundPage';
import {
  getScoreLabel,
  getShootoutLabel,
  getStageLabel,
  getTimeLabel,
} from './helper';

type TabValue = 'details' | 'players' | 'standings';

const GRADIENT_MAX_BRIGHTNESS = 125;

const darkenHexColor = (hex: string) => {
  const red = parseInt(hex.slice(1, 3), 16);
  const green = parseInt(hex.slice(3, 5), 16);
  const blue = parseInt(hex.slice(5, 7), 16);
  const scale = Math.min(
    1,
    GRADIENT_MAX_BRIGHTNESS / Math.max(red, green, blue, 1),
  );

  return `#${toHex(Math.round(red * scale))}${toHex(Math.round(green * scale))}${toHex(Math.round(blue * scale))}`;
};

const loadDominantColor = (url: string) =>
  new Promise<string>((resolve) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () =>
      resolve(getDominantLogoColor(image) ?? PLACEHOLDER_DOMINANT_COLOR);
    image.onerror = () => resolve(PLACEHOLDER_DOMINANT_COLOR);
    image.src = url;
  });

export const MatchDetailPage = () => {
  const [homeColor, setHomeColor] = useState(
    darkenHexColor(PLACEHOLDER_DOMINANT_COLOR),
  );
  const [awayColor, setAwayColor] = useState(
    darkenHexColor(PLACEHOLDER_DOMINANT_COLOR),
  );
  const [activeTab, setActiveTab] = useState<TabValue>('details');

  const params = useParams<{ matchId: string }>();
  const parsed = Number(params.matchId);
  const matchId = Number.isNaN(parsed) ? undefined : parsed;

  const { data: match, isLoading, isError } = useMatchGet(matchId);
  const {
    data: events,
    isLoading: areEventsLoading,
    isError: isEventsError,
  } = useMatchEventsGet(matchId);
  const { elapsedSeconds } = useMatchTimerLive(match?.isActive ? match.id : 0);
  useMatchEventsLive(match?.isActive ? match.id : 0);

  const panelRef = useRef<HTMLDivElement | null>(null);

  const homeLogoUrl = match?.homeTeam?.logoUrl;
  const awayLogoUrl = match?.awayTeam?.logoUrl;

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      homeLogoUrl
        ? loadDominantColor(homeLogoUrl)
        : Promise.resolve(PLACEHOLDER_DOMINANT_COLOR),
      awayLogoUrl
        ? loadDominantColor(awayLogoUrl)
        : Promise.resolve(PLACEHOLDER_DOMINANT_COLOR),
    ]).then(([home, away]) => {
      if (cancelled) return;
      setHomeColor(darkenHexColor(home));
      setAwayColor(darkenHexColor(away));
    });

    return () => {
      cancelled = true;
    };
  }, [homeLogoUrl, awayLogoUrl]);

  useEffect(() => {
    setActiveTab('details');
  }, [matchId]);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  if (!matchId) return <NotFoundPage />;

  const status = match ? getMatchStatus(match) : null;
  const isGroupMatch = match?.matchType === MatchType.group;
  const groupName =
    match?.homeTeam?.group?.name ?? match?.awayTeam?.group?.name;

  const stageLabel = getStageLabel(match, isGroupMatch, groupName);

  const scoreLabel = getScoreLabel(match, status, events);

  const shootoutLabel = getShootoutLabel(events);

  const timeLabel = getTimeLabel(match, status, elapsedSeconds);

  const tabs: { value: TabValue; label: string }[] = [
    { value: 'details', label: 'Detalji' },
    { value: 'players', label: 'Igrači' },
    { value: 'standings', label: isGroupMatch ? 'Skupina' : 'Ždrijeb' },
  ];

  const renderTabContent = () => {
    if (!match) return null;
    if (activeTab === 'players')
      return <MatchPlayers match={match} events={events} />;
    if (activeTab === 'standings')
      return isGroupMatch ? <MatchStanding match={match} /> : <MatchDraw />;
    return (
      <MatchTimeline
        match={match}
        events={events}
        isLoading={areEventsLoading}
        isError={isEventsError}
      />
    );
  };

  const renderPanelContent = () => {
    if (isLoading) return <Skeleton className={c.panelSkeleton} />;
    if (isError || !match)
      return <p className={c.message}>Greška pri učitavanju utakmice</p>;

    return (
      <>
        <div className={c.tabs} role='tablist'>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type='button'
              role='tab'
              aria-selected={tab.value === activeTab}
              className={clsx(c.tab, tab.value === activeTab && c.tabActive)}
              onClick={() => setActiveTab(tab.value)}>
              {tab.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </>
    );
  };

  return (
    <>
      <div className={c.desktopNav}>
        <Navbar />
      </div>
      <div
        className={c.page}
        style={{
          background: `linear-gradient(90deg, ${homeColor} 0%, ${awayColor} 100%)`,
        }}>
        <header className={c.header}>
          <Link
            href={routes.MATCHES}
            className={c.backButton}
            aria-label='Natrag'>
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

        <div className={c.panel} ref={panelRef}>
          {renderPanelContent()}
        </div>
      </div>
    </>
  );
};
