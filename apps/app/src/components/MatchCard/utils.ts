import { MatchDto } from '@futsal-app/types';
import { MATCH_STATUS } from '@constants/index';
import {
  formatMatchDateLong,
  formatMatchTime,
  getMatchMetaLabel,
  getMatchStatus,
} from '@helpers/index';

const getMatchView = (match: MatchDto, elapsedMinutes?: number) => {
  const status = getMatchStatus(match);

  return {
    isLive: status === MATCH_STATUS.LIVE,
    isUpcoming: status === MATCH_STATUS.UPCOMING,
    homeName: match.homeTeam?.name ?? 'TBD',
    awayName: match.awayTeam?.name ?? 'TBD',
    homeLogo: match.homeTeam?.logoUrl,
    awayLogo: match.awayTeam?.logoUrl,
    metaLabel: getMatchMetaLabel(match),
    dateLabel: formatMatchDateLong(match.timeOfMatch),
    startTime: formatMatchTime(match.timeOfMatch),
    liveLabel: elapsedMinutes != null ? `${elapsedMinutes}'` : '',
  };
};

export const getMatchCardLargeView = (
  match: MatchDto,
  elapsedMinutes?: number,
) => {
  const view = getMatchView(match, elapsedMinutes);

  return {
    ...view,
    score: view.isUpcoming ? '-' : `${match.homeGoals} - ${match.awayGoals}`,
  };
};

export const getMatchCardView = (match: MatchDto, elapsedMinutes?: number) => {
  const view = getMatchView(match, elapsedMinutes);
  const homeShootoutGoals = match.homeShootoutGoals ?? 0;
  const awayShootoutGoals = match.awayShootoutGoals ?? 0;
  const hasShootoutScore = homeShootoutGoals > 0 || awayShootoutGoals > 0;

  return {
    ...view,
    score: view.isUpcoming ? null : `${match.homeGoals} - ${match.awayGoals}`,
    shootoutScore:
      !view.isUpcoming && hasShootoutScore
        ? `(${homeShootoutGoals} - ${awayShootoutGoals})`
        : null,
  };
};
