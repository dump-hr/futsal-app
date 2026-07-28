import { MatchDto, MatchType } from '@futsal-app/types';
import { MATCH_STATUS, MATCH_STAGE } from '@components/MatchInfo/constants';
import type { MatchStage, MatchStatus } from '@components/MatchInfo/types';
import { validateTime } from './formatMatchDate';

const CROATIAN_DAY_NAMES = [
  'Nedjelja',
  'Ponedjeljak',
  'Utorak',
  'Srijeda',
  'Četvrtak',
  'Petak',
  'Subota',
];

export const MATCH_TYPE_OPTIONS: { label: string; value: string }[] = [
  { label: 'Grupna faza', value: MatchType.group },
  { label: 'Četvrtfinale', value: MatchType.quarterFinal },
  { label: 'Polufinale', value: MatchType.semiFinal },
  { label: 'Finale', value: MatchType.final },
  { label: 'Za 3. mjesto', value: MatchType.thirdPlace },
];

export const MATCH_TYPE_TO_STAGE: Record<string, MatchStage> = {
  group: MATCH_STAGE.GROUP_STAGE,
  quarterFinal: MATCH_STAGE.QUARTER_FINALS,
  semiFinal: MATCH_STAGE.SEMI_FINALS,
  final: MATCH_STAGE.FINAL,
  thirdPlace: MATCH_STAGE.FINAL,
};

export const getMatchStatus = (match: MatchDto): MatchStatus => {
  if (match.isActive) return MATCH_STATUS.LIVE;
  return match.isFinished ? MATCH_STATUS.FINISHED : MATCH_STATUS.UPCOMING;
};

const getDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const formatMatchDayHeader = (date: Date): string => {
  const day = CROATIAN_DAY_NAMES[date.getDay()];
  return `${day}, ${date.getDate()}/${date.getMonth() + 1}`;
};

type MatchFormInput = {
  date: string;
  time: string;
  matchType: string;
  homeTeamId: string;
  awayTeamId: string;
};

export const validateMatchForm = (input: MatchFormInput): string | null => {
  const { date, time, matchType, homeTeamId, awayTeamId } = input;

  if (!date || !time || !matchType) return 'Molimo ispunite sva polja';

  const timeError = validateTime(time);
  if (timeError) return timeError;

  if (!homeTeamId || !awayTeamId) return 'Molimo odaberite ekipe';
  if (homeTeamId === awayTeamId) return 'Ekipe moraju biti različite';

  return null;
};

export type MatchDayGroup = {
  dateKey: string;
  dateLabel: string;
  matches: MatchDto[];
};

type GroupMatchesOptions = {
  matchTypeFilter: string;
  teamFilter: string;
  dateSort: 'asc' | 'desc';
};

export const groupMatchesByDay = (
  matches: MatchDto[] | undefined,
  { matchTypeFilter, teamFilter, dateSort }: GroupMatchesOptions,
): MatchDayGroup[] => {
  if (!matches) return [];

  const filtered = matches.filter((m) => {
    if (matchTypeFilter !== 'all' && m.matchType !== matchTypeFilter)
      return false;
    if (
      teamFilter !== 'all' &&
      String(m.homeTeam?.id) !== teamFilter &&
      String(m.awayTeam?.id) !== teamFilter
    )
      return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const diff =
      new Date(a.timeOfMatch).getTime() - new Date(b.timeOfMatch).getTime();
    return dateSort === 'desc' ? -diff : diff;
  });

  const groups = new Map<string, MatchDayGroup>();
  for (const match of sorted) {
    const date = new Date(match.timeOfMatch);
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

