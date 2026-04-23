import { type MatchStage } from '.';

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

export const MATCH_STAGE_LABEL: Record<MatchStage, string> = {
  [MATCH_STAGE.GROUP_STAGE]: 'Grupa',
  [MATCH_STAGE.QUARTER_FINALS]: 'Četvrtfinale',
  [MATCH_STAGE.SEMI_FINALS]: 'Polufinale',
  [MATCH_STAGE.FINAL]: 'Finale',
};

export const MATCH_TYPE_TO_STAGE: Record<string, MatchStage> = {
  group: MATCH_STAGE.GROUP_STAGE,
  quarterFinal: MATCH_STAGE.QUARTER_FINALS,
  semiFinal: MATCH_STAGE.SEMI_FINALS,
  final: MATCH_STAGE.FINAL,
  thirdPlace: MATCH_STAGE.FINAL,
};
