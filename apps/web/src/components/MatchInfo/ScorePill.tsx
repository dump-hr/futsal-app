import c from './MatchInfo.module.scss';

type ScorePillProps = {
  teamAScore?: number;
  teamBScore?: number;
  isUpcoming: boolean;
};

export const ScorePill: React.FC<ScorePillProps> = ({
  teamAScore,
  teamBScore,
  isUpcoming,
}) => {
  return (
    <div className={c.scorePill}>
      {isUpcoming ? 'VS' : `${teamAScore} : ${teamBScore}`}
    </div>
  );
};
