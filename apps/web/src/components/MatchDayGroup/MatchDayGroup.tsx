import { MatchDto } from '@futsal-app/types';
import { MatchInfo, MATCH_STAGE } from '@components/MatchInfo';
import { MATCH_TYPE_TO_STAGE, getMatchStatus } from '@helpers/matchHelpers';
import c from './MatchDayGroup.module.scss';

type MatchDayGroupProps = {
  dateLabel: string;
  matches: MatchDto[];
  onEdit?: (matchId: number) => void;
  onDelete?: (matchId: number) => void;
};

export const MatchDayGroup: React.FC<MatchDayGroupProps> = ({
  dateLabel,
  matches,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={c.group}>
      <h2 className={c.dateHeader}>{dateLabel}</h2>
      <div className={c.matchList}>
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
            onEdit={onEdit ? () => onEdit(match.id) : undefined}
            onDelete={onDelete ? () => onDelete(match.id) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
