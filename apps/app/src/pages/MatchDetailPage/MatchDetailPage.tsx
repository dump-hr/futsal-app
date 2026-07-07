import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'wouter';
import clsx from 'clsx';
import { MatchType } from '@futsal-app/types';
import { useMatchGet, useMatchEventsGet, useMatchTimerLive } from '@api/index';
import { Navbar, TeamLogo } from '@components/index';
import {
  getDominantLogoColor,
  PLACEHOLDER_DOMINANT_COLOR,
  toHex,
} from '@components/Team/utils';
import { MATCH_STATUS, MATCH_TYPE_LABELS } from '@constants/index';
import { formatMatchDateLong, getMatchStatus } from '@helpers/index';
import { routes } from '@routes/index';
import { ArrowLeftWhite } from '@assets/index';
import { MatchTimeline } from './MatchTimeline';
import { MatchPlayers } from './MatchPlayers';
import { MatchStanding } from './MatchStanding';
import { MatchDraw } from './MatchDraw';
import c from './MatchDetailPage.module.scss';
import hajduk from '@assets/icons/hajduk.png';
import google from '@assets/icons/google.svg';
import infobip from '@assets/icons/infobip.svg';
import otp from '@assets/icons/otp.svg';

type TabValue = 'details' | 'players' | 'standings';

const pad = (n: number) => String(n).padStart(2, '0');

const GRADIENT_MAX_BRIGHTNESS = 95;

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
  const params = useParams<{ matchId: string }>();
  const parsed = Number(params.matchId);
  const matchId = Number.isNaN(parsed) ? undefined : parsed;

  const [activeTab, setActiveTab] = useState<TabValue>('details');
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setActiveTab('details');
  }, [matchId]);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [activeTab]);

  const { data: match, isLoading, isError } = useMatchGet(matchId);
  const {
    data: events,
    isLoading: areEventsLoading,
    isError: isEventsError,
  } = useMatchEventsGet(matchId);
  const { elapsedSeconds } = useMatchTimerLive(match?.isActive ? match.id : 0);
  const homeLogoUrl = infobip;
  const awayLogoUrl = infobip;

  const [homeColor, setHomeColor] = useState(
    darkenHexColor(PLACEHOLDER_DOMINANT_COLOR),
  );
  const [awayColor, setAwayColor] = useState(
    darkenHexColor(PLACEHOLDER_DOMINANT_COLOR),
  );

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      loadDominantColor(homeLogoUrl),
      loadDominantColor(awayLogoUrl),
    ]).then(([home, away]) => {
      if (cancelled) return;
      setHomeColor(darkenHexColor(home));
      setAwayColor(darkenHexColor(away));
    });

    return () => {
      cancelled = true;
    };
  }, [homeLogoUrl, awayLogoUrl]);

  if (!matchId) return null;

  const status = match ? getMatchStatus(match) : null;
  const isGroupMatch = match?.matchType === MatchType.group;
  const groupName =
    match?.homeTeam?.group?.name ?? match?.awayTeam?.group?.name;

  const stageLabel = !match
    ? ''
    : isGroupMatch
      ? groupName
        ? `SKUPINA ${groupName}`
        : ''
      : MATCH_TYPE_LABELS[match.matchType];

  const scoreLabel = !match
    ? ''
    : status === MATCH_STATUS.UPCOMING
      ? '-'
      : `${match.homeGoals} - ${match.awayGoals}`;

  const timeLabel = !match
    ? ''
    : status === MATCH_STATUS.LIVE
      ? `${pad(Math.floor(elapsedSeconds / 60))}:${pad(elapsedSeconds % 60)}`
      : status === MATCH_STATUS.UPCOMING
        ? formatMatchDateLong(match.timeOfMatch)
        : '';

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
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
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
              <TeamLogo
                name={match?.homeTeam?.name ?? 'TBD'}
                logoUrl={homeLogoUrl}
                className={c.teamLogo}
              />
              <span className={c.teamName}>
                {match?.homeTeam?.name ?? 'TBD'}
              </span>
            </div>
            <div className={c.center}>
              {stageLabel && <span className={c.stage}>{stageLabel}</span>}
              <span className={c.score}>{scoreLabel}</span>
              {timeLabel && <span className={c.time}>{timeLabel}</span>}
            </div>
            <div className={c.team}>
              <TeamLogo
                name={match?.awayTeam?.name ?? 'TBD'}
                logoUrl={awayLogoUrl}
                className={c.teamLogo}
              />
              <span className={c.teamName}>
                {match?.awayTeam?.name ?? 'TBD'}
              </span>
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
