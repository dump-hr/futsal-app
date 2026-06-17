import { MatchDto } from '@futsal-app/types';
import { MATCH_TYPE_TO_STAGE, getMatchStatus } from '@helpers/matchHelpers';
import { MatchInfo } from './MatchInfo';
import { MATCH_STAGE } from './constants';

type MatchInfoFromDtoProps = {
  match: MatchDto;
  onEdit?: (matchId: number) => void;
  onDelete?: (matchId: number) => void;
  onActivate?: (matchId: number) => void;
  onTimer?: (matchId: number) => void;
};

export const MatchInfoFromDto: React.FC<MatchInfoFromDtoProps> = ({
  match,
  onEdit,
  onDelete,
  onActivate,
  onTimer,
}) => {
  return (
    <MatchInfo
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
      onEdit={onEdit ? () => onEdit(match.id) : undefined}
      onDelete={onDelete ? () => onDelete(match.id) : undefined}
      onActivate={onActivate ? () => onActivate(match.id) : undefined}
      onTimer={onTimer ? () => onTimer(match.id) : undefined}
    />
  );
};
