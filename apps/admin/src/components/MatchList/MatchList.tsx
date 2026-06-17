import { MatchDto } from '@futsal-app/types';
import { MatchInfoFromDto } from '@components/index';
import c from './MatchList.module.scss';

type MatchListProps = {
  matches: MatchDto[];
};

export const MatchList: React.FC<MatchListProps> = ({ matches }) => {
  if (matches.length === 0) {
    return <span className={c.empty}>Još nema utakmica za ovu ekipu</span>;
  }

  return (
    <div className={c.list}>
      {matches.map((match) => (
        <MatchInfoFromDto key={match.id} match={match} />
      ))}
    </div>
  );
};
