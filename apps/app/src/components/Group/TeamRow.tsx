import clsx from 'clsx';
import { TeamDto } from '@futsal-app/types';
import c from './Group.module.scss';

type TeamRowProps = {
  team: TeamDto;
  position: number;
};

export const TeamRow: React.FC<TeamRowProps> = ({ team, position }) => {
  return (
    <div className={c.teamRow}>
      <div className={c.teamRowLeft}>
        <div className={clsx(c.text, c.mr26)}>{position}</div>
        {team.logoUrl ? (
          <img className={c.logo} src={team.logoUrl} alt={team.name} />
        ) : (
          <span className={c.logoPlaceholder} aria-hidden>
            ?
          </span>
        )}
        <div className={clsx(c.text, c.teamName)}>{team.name}</div>
      </div>
      <div className={c.teamRowRight}>
        <div className={clsx(c.text, c.statCell)}>
          {team.numberOfMatchesPlayed}
        </div>
        <div className={clsx(c.text, c.statCell)}>{team.goalDifference}</div>
        <div className={clsx(c.text, c.statCell)}>{team.teamScore}</div>
      </div>
    </div>
  );
};
