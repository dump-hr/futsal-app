import { MATCH_STAGE, MATCH_STATUS } from './constants';

export type MatchStatus = (typeof MATCH_STATUS)[keyof typeof MATCH_STATUS];

export type MatchStage = (typeof MATCH_STAGE)[keyof typeof MATCH_STAGE];

export interface TeamInfo {
  teamName: string;
  logoUrl: string;
  score?: number;
}
