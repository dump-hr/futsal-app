export const MATCH_STATUS = {
  UPCOMING: 'UPCOMING',
  LIVE: 'LIVE',
  FINISHED: 'FINISHED',
} as const;

export const MATCH_STAGE = {
  GROUP_STAGE: 'GROUP_STAGE',
  QUARTER_FINALS: 'QUARTER_FINALS',
  SEMI_FINALS: 'SEMI_FINALS',
  FINAL: 'FINAL',
} as const;

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];
export type MatchStage = (typeof MATCH_STAGE)[keyof typeof MATCH_STAGE];

export const MATCH_STAGE_LABEL: Record<MatchStage, string> = {
  [MATCH_STAGE.GROUP_STAGE]: 'Grupa',
  [MATCH_STAGE.QUARTER_FINALS]: 'Četvrtfinale',
  [MATCH_STAGE.SEMI_FINALS]: 'Polufinale',
  [MATCH_STAGE.FINAL]: 'Finale',
};
