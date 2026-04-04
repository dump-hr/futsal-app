export type MatchTypeFilter = 'all' | string;
export type DateSort = 'asc' | 'desc';
export type TeamFilter = 'all' | string;

export const DATE_SORT_OPTIONS: { label: string; value: DateSort }[] = [
  { label: 'Najranije', value: 'asc' },
  { label: 'Najkasnije', value: 'desc' },
];

export const MATCH_TYPE_OPTIONS: { label: string; value: MatchTypeFilter }[] = [
  { label: 'Tip utakmice', value: 'all' },
  { label: 'Grupna faza', value: 'group' },
  { label: 'Četvrtfinale', value: 'quarterFinal' },
  { label: 'Polufinale', value: 'semiFinal' },
  { label: 'Finale', value: 'final' },
  { label: 'Za 3. mjesto', value: 'thirdPlace' },
];
