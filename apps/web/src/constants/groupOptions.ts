import { Group } from '@futsal-app/types';

export type GroupOption = 'none' | `${Group}`;

export const GROUP_OPTIONS: { label: string; value: GroupOption }[] = [
  { label: 'Bez skupine', value: 'none' },
  { label: 'Skupina A', value: 'A' },
  { label: 'Skupina B', value: 'B' },
  { label: 'Skupina C', value: 'C' },
  { label: 'Skupina D', value: 'D' },
];
