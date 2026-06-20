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

export const getElapsedMs = (timer: MatchTimerStateDto): number => {
  const liveMs =
    timer.isRunning && timer.startedAt
      ? Date.now() - toDate(timer.startedAt).getTime()
      : 0;
  return timer.accumulatedMs + liveMs;
};

export const getElapsedMinutes = (timer: MatchTimerStateDto): number =>
  Math.floor(getElapsedMs(timer) / 60_000);

export const formatMatchDayHeader = (value: string | Date): string => {
  const date = toDate(value);
  return `${date.getDate()}. ${CROATIAN_MONTHS_GENITIVE[date.getMonth()]}`;
};

const getDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export type MatchDayGroup = {
  dateKey: string;
  dateLabel: string;
  matches: MatchDto[];
};

type MatchFilters = {
  status: MatchStatus | null;
  group: string | null;
  teamId: number | null;
};

export const groupMatchesByDay = (
  matches: MatchDto[] | undefined,
  { status, group, teamId }: MatchFilters,
): MatchDayGroup[] => {
  if (!matches) return [];

  const filtered = matches.filter((match) => {
    if (status && getMatchStatus(match) !== status) return false;
    if (
      group &&
      match.homeTeam?.group?.name !== group &&
      match.awayTeam?.group?.name !== group
    )
      return false;
    if (
      teamId != null &&
      match.homeTeam?.id !== teamId &&
      match.awayTeam?.id !== teamId
    )
      return false;
    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) => toDate(a.timeOfMatch).getTime() - toDate(b.timeOfMatch).getTime(),
  );

  const groups = new Map<string, MatchDayGroup>();
  for (const match of sorted) {
    const date = toDate(match.timeOfMatch);
    const key = getDateKey(date);
    if (!groups.has(key)) {
      groups.set(key, {
        dateKey: key,
        dateLabel: formatMatchDayHeader(date),
        matches: [],
      });
    }
    groups.get(key)!.matches.push(match);
  }

  return Array.from(groups.values());
};
