import { MatchDto } from '@futsal-app/types';
import {
  MatchInfo,
  MATCH_STATUS,
  MATCH_STAGE,
  MATCH_TYPE_TO_STAGE,
} from '@components/MatchInfo';
import type { MatchStatus } from '@components/MatchInfo';
import c from './MatchList.module.scss';

type MatchListProps = {
  matches: MatchDto[];
};

const getMatchStatus = (match: MatchDto): MatchStatus => {
  if (match.isActive) return MATCH_STATUS.LIVE;
  const matchTime = new Date(match.timeOfMatch);
  return matchTime < new Date() ? MATCH_STATUS.FINISHED : MATCH_STATUS.UPCOMING;
};

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <span className={c.empty}>Još nema utakmica za ovu ekipu</span>;
  }

  return (
    <div className={c.list}>
      {matches.map((match) => (
        <MatchInfo
          key={match.id}
          teamA={{
            teamName: match.homeTeam?.name ?? 'TBD',
            logoUrl: match.homeTeam?.logoUrl ?? '',
          }}
          teamB={{
            teamName: match.awayTeam?.name ?? 'TBD',
            logoUrl: match.awayTeam?.logoUrl ?? '',
          }}
          teamAScore={match.homeGoals}
          teamBScore={match.awayGoals}
          matchTime={new Date(match.timeOfMatch).toLocaleTimeString('hr', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          matchStage={
            MATCH_TYPE_TO_STAGE[match.matchType] ?? MATCH_STAGE.GROUP_STAGE
          }
          matchStatus={getMatchStatus(match)}
        />
      ))}
    </div>
  );
};

export default MatchList;