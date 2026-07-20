import { EventType, MatchDto, MatchEventDto } from '@futsal-app/types';
import {
  MATCH_STATUS,
  MATCH_TYPE_LABELS,
  type MatchStatus,
} from '@constants/index';
import { formatMatchDateLong } from '@helpers/index';

const pad = (n: number) => String(n).padStart(2, '0');

export const getStageLabel = (
  match: MatchDto | undefined,
  isGroupMatch: boolean,
  groupName: string | undefined,
) => {
  return !match
    ? ''
    : isGroupMatch
      ? groupName
        ? `SKUPINA ${groupName}`
        : ''
      : MATCH_TYPE_LABELS[match.matchType];
};

const getShootoutCounts = (events: MatchEventDto[] | undefined) => {
  const counts = { home: 0, away: 0 };
  for (const event of events ?? []) {
    if (event.eventType !== EventType.shootoutGoal) continue;
    if (event.isForHomeTeam) counts.home += 1;
    else counts.away += 1;
  }
  return counts;
};

export const getScoreLabel = (
  match: MatchDto | undefined,
  status: MatchStatus | null,
  events?: MatchEventDto[],
) => {
  if (!match) return '';
  if (status === MATCH_STATUS.UPCOMING) return '-';

  const shootout = getShootoutCounts(events);
  const homeTotal = match.homeGoals + shootout.home;
  const awayTotal = match.awayGoals + shootout.away;
  const base = `${homeTotal} - ${awayTotal}`;
  if (shootout.home === 0 && shootout.away === 0) return base;

  return `(${shootout.home}) ${base} (${shootout.away})`;
};

export const getTimeLabel = (
  match: MatchDto | undefined,
  status: MatchStatus | null,
  elapsedSeconds: number,
) => {
  return !match
    ? ''
    : status === MATCH_STATUS.LIVE
      ? `${pad(Math.floor(elapsedSeconds / 60))}:${pad(elapsedSeconds % 60)}`
      : status === MATCH_STATUS.UPCOMING
        ? formatMatchDateLong(match.timeOfMatch)
        : '';
};
