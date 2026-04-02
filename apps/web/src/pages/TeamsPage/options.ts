export type SortOrder = 'az' | 'za';
export type GroupFilter = 'all' | 'A' | 'B' | 'C' | 'D';

export const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Abecedno (A do Z)', value: 'az' },
  { label: 'Abecedno (Z do A)', value: 'za' },
];

export const GROUP_OPTIONS: { label: string; value: GroupFilter }[] = [
  { label: 'Skupina', value: 'all' },
  { label: 'Skupina A', value: 'A' },
  { label: 'Skupina B', value: 'B' },
  { label: 'Skupina C', value: 'C' },
  { label: 'Skupina D', value: 'D' },
];
