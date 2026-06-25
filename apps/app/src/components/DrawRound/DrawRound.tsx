import clsx from 'clsx';
import { TeamLogo } from '@components/TeamLogo';
import c from './DrawRound.module.scss';

type Team = {
  name: string;
  logoUrl?: string | null;
};

type DrawRoundProps = {
  teamA: Team;
  teamB: Team;
  className?: string;
} & (
  | {
      status: 'ACTIVE';
      teamAScore: number;
      teamBScore: number;
    }
  | {
      status: 'UPCOMING';
      matchDate: string;
      matchTime: string;
    }
);

export const DrawRound: React.FC<DrawRoundProps> = (props) => {
  const { teamA, teamB, className } = props;

  return (
    <div className={clsx(c.card, className)}>
      <div className={c.teams}>
        <div className={c.teamRow}>
          <TeamLogo name={teamA.name} logoUrl={teamA.logoUrl} className={c.logo} />
          <span className={c.teamName}>{teamA.name}</span>
        </div>
        <div className={c.teamRow}>
          <TeamLogo name={teamB.name} logoUrl={teamB.logoUrl} className={c.logo} />
          <span className={c.teamName}>{teamB.name}</span>
        </div>
      </div>

      {props.status === 'ACTIVE' ? (
        <div className={c.scores}>
          <span className={c.score}>{props.teamAScore}</span>
          <span className={c.score}>{props.teamBScore}</span>
        </div>
      ) : (
        <div className={c.dateTime}>
          <span className={c.date}>{props.matchDate}</span>
          <span className={c.time}>{props.matchTime}</span>
        </div>
      )}
    </div>
  );
};
