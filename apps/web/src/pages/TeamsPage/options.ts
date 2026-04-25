export type SortOrder = 'az' | 'za';
export type GroupFilter = 'all' | string;

export const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Abecedno (A do Z)', value: 'az' },
  { label: 'Abecedno (Z do A)', value: 'za' },
];
