import { MATCH_TYPE_OPTIONS as MATCH_TYPE_BASE_OPTIONS } from '@helpers/matchHelpers';

export type MatchTypeFilter = 'all' | string;
export type DateSort = 'asc' | 'desc';
export type TeamFilter = 'all' | string;

export const DATE_SORT_OPTIONS: { label: string; value: DateSort }[] = [
  { label: 'Najranije', value: 'asc' },
  { label: 'Najkasnije', value: 'desc' },
];

export const MATCH_TYPE_OPTIONS: { label: string; value: MatchTypeFilter }[] = [
  { label: 'Tip utakmice', value: 'all' },
  ...MATCH_TYPE_BASE_OPTIONS,
];
