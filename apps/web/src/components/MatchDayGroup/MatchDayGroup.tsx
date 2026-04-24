import { MatchDto } from '@futsal-app/types';
import { MatchInfoFromDto } from '@components/MatchInfo';
import c from './MatchDayGroup.module.scss';

type MatchDayGroupProps = {
  dateLabel: string;
  matches: MatchDto[];
  onEdit?: (matchId: number) => void;
  onDelete?: (matchId: number) => void;
};

const MatchDayGroup: React.FC<MatchDayGroupProps> = ({
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
          <MatchInfoFromDto
            key={match.id}
            match={match}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default MatchDayGroup;
