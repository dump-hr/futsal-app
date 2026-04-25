import { MatchDto } from '@futsal-app/types';
import { MatchInfoFromDto } from '@components/MatchInfo';
import c from './MatchList.module.scss';

type MatchListProps = {
  matches: MatchDto[];
};

const MatchList: React.FC<MatchListProps> = ({ matches }) => {
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

export default MatchList;
