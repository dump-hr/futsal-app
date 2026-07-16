import { MATCH_STATUS, MATCH_TYPE_LABELS } from '@constants/index';
import { formatMatchDateLong } from '@helpers/index';

const pad = (n: number) => String(n).padStart(2, '0');

export const getStageLabel = (
  match: any,
  isGroupMatch: boolean,
  groupName: string | undefined,
) => {
  return !match
    ? ''
    : isGroupMatch
      ? groupName
        ? `SKUPINA ${groupName}`
        : ''
      : MATCH_TYPE_LABELS[match.matchType];
};

export const getScoreLabel = (match: any, status: string | null) => {
  return !match
    ? ''
    : status === MATCH_STATUS.UPCOMING
      ? '-'
      : `${match.homeGoals} - ${match.awayGoals}`;
};

export const getTimeLabel = (
  match: any,
  status: string | null,
  elapsedSeconds: number,
) => {
  return !match
    ? ''
    : status === MATCH_STATUS.LIVE
      ? `${pad(Math.floor(elapsedSeconds / 60))}:${pad(elapsedSeconds % 60)}`
      : status === MATCH_STATUS.UPCOMING
        ? formatMatchDateLong(match.timeOfMatch)
        : '';
};
