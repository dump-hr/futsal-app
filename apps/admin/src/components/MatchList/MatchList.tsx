import { MatchDto } from '@futsal-app/types';
import { MatchInfoFromDto } from '@components/index';
import c from './MatchList.module.scss';

type MatchListProps = {
  matches: MatchDto[];
  onEdit?: (matchId: number) => void;
  onDelete?: (matchId: number) => void;
  onActivate?: (matchId: number) => void;
  onTimer?: (matchId: number) => void;
};

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  onEdit,
  onDelete,
  onActivate,
  onTimer,
}) => {
  if (matches.length === 0) {
    return <span className={c.empty}>Još nema utakmica za ovu ekipu</span>;
  }

  return (
    <div className={c.list}>
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
  );
};
