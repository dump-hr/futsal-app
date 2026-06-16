import { MatchDto } from '@futsal-app/types';
import { MatchInfoFromDto } from '@components/index';
import c from './MatchDayGroup.module.scss';

type MatchDayGroupProps = {
  dateLabel: string;
  matches: MatchDto[];
  onEdit?: (matchId: number) => void;
  onDelete?: (matchId: number) => void;
  onActivate?: (matchId: number) => void;
  onTimer?: (matchId: number) => void;
};

export const MatchDayGroup: React.FC<MatchDayGroupProps> = ({
  dateLabel,
  matches,
  onEdit,
  onDelete,
  onActivate,
  onTimer,
}) => {
  return (
    <div className={c.group}>
      <h2 className={c.dateHeader}>{dateLabel}</h2>
      <div className={c.matchList}>
        {matches.map((match) => (
          <MatchInfoFromDto
            key={match.id}
            match={match}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
            onTimer={onTimer}
          />
        ))}
      </div>
    </div>
  );
};
