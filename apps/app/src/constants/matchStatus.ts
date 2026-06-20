import { MatchType } from '@futsal-app/types';

export const MATCH_STATUS = {
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
} as const;

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

export const MATCH_TYPE_LABELS: Record<`${MatchType}`, string> = {
  group: 'SKUPINA',
  quarterFinal: 'ČETVRTFINALE',
  semiFinal: 'POLUFINALE',
  final: 'FINALE',
  thirdPlace: 'TREĆE MJESTO',
};
