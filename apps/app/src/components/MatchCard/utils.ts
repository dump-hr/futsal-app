import { MatchDto } from '@futsal-app/types';
import { MATCH_STATUS } from '@constants/index';
import {
  formatMatchDateLong,
  formatMatchTime,
  getMatchMetaLabel,
  getMatchStatus,
} from '@helpers/index';

export const getMatchCardLargeView = (
  match: MatchDto,
  elapsedMinutes?: number,
) => {
  const status = getMatchStatus(match);
  const isUpcoming = status === MATCH_STATUS.UPCOMING;

  return {
    isLive: status === MATCH_STATUS.LIVE,
    homeName: match.homeTeam?.name ?? 'TBD',
    awayName: match.awayTeam?.name ?? 'TBD',
    homeLogo: match.homeTeam?.logoUrl,
    awayLogo: match.awayTeam?.logoUrl,
    score: isUpcoming ? '-' : `${match.homeGoals} - ${match.awayGoals}`,
    metaLabel: getMatchMetaLabel(match),
    dateLabel: formatMatchDateLong(match.timeOfMatch),
    startTime: formatMatchTime(match.timeOfMatch),
    liveLabel: elapsedMinutes != null ? `${elapsedMinutes}'` : '',
  };
};
