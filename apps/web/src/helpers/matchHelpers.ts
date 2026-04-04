import { MatchDto, MatchType } from '@futsal-app/types';
import { MATCH_STATUS, MATCH_STAGE } from '@components/MatchInfo';
import type { MatchStage, MatchStatus } from '@components/MatchInfo';

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
  const matchTime = new Date(match.timeOfMatch);
  return matchTime < new Date() ? MATCH_STATUS.FINISHED : MATCH_STATUS.UPCOMING;
};

export const getDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatMatchDayHeader = (date: Date): string => {
  const day = CROATIAN_DAY_NAMES[date.getDay()];
  return `${day}, ${date.getDate()}/${date.getMonth() + 1}`;
};

