import { MatchDto, MatchTimerStateDto } from '@futsal-app/types';
import {
  MATCH_STATUS,
  MATCH_TYPE_LABELS,
  type MatchStatus,
} from '@constants/index';

const CROATIAN_MONTHS_GENITIVE = [
  'siječnja',
  'veljače',
  'ožujka',
  'travnja',
  'svibnja',
  'lipnja',
  'srpnja',
  'kolovoza',
  'rujna',
  'listopada',
  'studenoga',
  'prosinca',
];

const pad = (n: number) => String(n).padStart(2, '0');

const toDate = (value: string | Date): Date =>
  value instanceof Date ? value : new Date(value);

export const getMatchStatus = (match: MatchDto): MatchStatus => {
  if (match.isActive) return MATCH_STATUS.LIVE;
  return toDate(match.timeOfMatch) < new Date()
    ? MATCH_STATUS.FINISHED
    : MATCH_STATUS.UPCOMING;
};

export const formatMatchTime = (value: string | Date): string => {
  const date = toDate(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const formatMatchDateLong = (value: string | Date): string => {
  const date = toDate(value);
  return `${date.getDate()}. ${CROATIAN_MONTHS_GENITIVE[date.getMonth()]}, ${formatMatchTime(date)}`;
};

export const getMatchMetaLabel = (match: MatchDto): string => {
  const stage = MATCH_TYPE_LABELS[match.matchType];
  if (match.matchType === 'group') {
    const groupName =
      match.homeTeam?.group?.name ?? match.awayTeam?.group?.name;
    return groupName ? `${stage} ${groupName}` : stage;
  }
  return stage;
};

export const getElapsedMinutes = (timer: MatchTimerStateDto): number => {
  const liveMs =
    timer.isRunning && timer.startedAt
      ? Date.now() - toDate(timer.startedAt).getTime()
      : 0;
  return Math.floor((timer.accumulatedMs + liveMs) / 60_000);
};
