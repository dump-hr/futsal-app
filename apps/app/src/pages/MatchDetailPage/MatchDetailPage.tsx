import { useState } from 'react';
import { Link, useParams } from 'wouter';
import clsx from 'clsx';
import { MatchType } from '@futsal-app/types';
import { useMatchGet, useMatchEventsGet, useMatchTimerLive } from '@api/index';
import { TeamLogo } from '@components/index';
import { MATCH_STATUS, MATCH_TYPE_LABELS } from '@constants/index';
import { formatMatchDateLong, getMatchStatus } from '@helpers/index';
import { routes } from '@routes/index';
import { ArrowLeftWhite } from '@assets/index';
import { MatchTimeline } from './MatchTimeline';
import { MatchPlayers } from './MatchPlayers';
import { MatchStanding } from './MatchStanding';
import { MatchDraw } from './MatchDraw';
import { useTeamColors } from './useTeamColors';
import c from './MatchDetailPage.module.scss';

type TabValue = 'details' | 'players' | 'standings';

const pad = (n: number) => String(n).padStart(2, '0');

export const MatchDetailPage = () => {
  const params = useParams<{ matchId: string }>();
  const parsed = Number(params.matchId);
  const matchId = Number.isNaN(parsed) ? undefined : parsed;

  const [activeTab, setActiveTab] = useState<TabValue>('details');

  const { data: match, isLoading, isError } = useMatchGet(matchId);
  const {
    data: events,
    isLoading: areEventsLoading,
    isError: isEventsError,
  } = useMatchEventsGet(matchId);
  const { elapsedSeconds } = useMatchTimerLive(match?.isActive ? match.id : 0);
  const [homeColor, awayColor] = useTeamColors(
    match?.homeTeam?.logoUrl,
    match?.awayTeam?.logoUrl,
  );

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
              logoUrl={match?.homeTeam?.logoUrl}
              className={c.teamLogo}
            />
            <span className={c.teamName}>{match?.homeTeam?.name ?? 'TBD'}</span>
          </div>
          <div className={c.center}>
            {stageLabel && <span className={c.stage}>{stageLabel}</span>}
            <span className={c.score}>{scoreLabel}</span>
            {timeLabel && <span className={c.time}>{timeLabel}</span>}
          </div>
          <div className={c.team}>
            <TeamLogo
              name={match?.awayTeam?.name ?? 'TBD'}
              logoUrl={match?.awayTeam?.logoUrl}
              className={c.teamLogo}
            />
            <span className={c.teamName}>{match?.awayTeam?.name ?? 'TBD'}</span>
          </div>
        </div>
      </header>

      <div className={c.panel}>{renderPanelContent()}</div>
    </div>
  );
};
