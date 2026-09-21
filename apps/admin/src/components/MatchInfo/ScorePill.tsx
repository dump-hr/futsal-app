import c from './MatchInfo.module.scss';

type ScorePillProps = {
  teamAScore?: number;
  teamBScore?: number;
  teamAShootoutScore?: number;
  teamBShootoutScore?: number;
  isUpcoming: boolean;
};

export const ScorePill: React.FC<ScorePillProps> = ({
  teamAScore,
  teamBScore,
  teamAShootoutScore = 0,
  teamBShootoutScore = 0,
  isUpcoming,
}) => {
  const hasShootoutScore = teamAShootoutScore > 0 || teamBShootoutScore > 0;

  return (
    <div className={c.scorePill}>
      {isUpcoming ? (
        'VS'
      ) : (
        <>
          <span>
            {teamAScore} : {teamBScore}
          </span>
          {hasShootoutScore && (
            <span className={c.shootoutScore}>
              ({teamAShootoutScore} - {teamBShootoutScore})
            </span>
          )}
        </>
      )}
    </div>
  );
};
