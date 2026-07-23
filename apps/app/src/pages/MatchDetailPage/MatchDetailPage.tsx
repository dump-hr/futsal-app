import { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
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
} from '@components/index';
import {
  getDominantLogoColor,
  PLACEHOLDER_DOMINANT_COLOR,
  toHex,
} from '@components/Team/utils';
import { getMatchStatus } from '@helpers/index';
import c from './MatchDetailPage.module.scss';
import { NotFoundPage } from '@pages/NotFoundPage';
import {
  getScoreLabel,
  getShootoutLabel,
  getStageLabel,
  getTimeLabel,
} from './helper';
import { MatchDetailHeader } from './MatchDetailHeader';

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

  const scoreLabel = getScoreLabel(match, status);

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
        <MatchDetailHeader
          match={match}
          isLoading={isLoading}
          stageLabel={stageLabel}
          scoreLabel={scoreLabel}
          shootoutLabel={shootoutLabel}
          timeLabel={timeLabel}
          homeLogoUrl={homeLogoUrl}
          awayLogoUrl={awayLogoUrl}
        />

        <div className={c.panel} ref={panelRef}>
          {renderPanelContent()}
        </div>
      </div>
    </>
  );
};
