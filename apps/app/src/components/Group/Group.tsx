import clsx from 'clsx';
import c from './Group.module.scss';
import { GroupDto } from '@futsal-app/types';

type GroupProps = {
  group: GroupDto;
};

export const Group: React.FC<GroupProps> = ({ group }) => {
  return (
    <div className={c.container}>
      <div className={c.name}>{group.name}</div>
      <div>
        <div className={c.labelsContainer}>
          <div className={c.labelsLeft}>
            <div className={c.labelText}>#</div>
            <div className={c.labelText}>Tim</div>
          </div>
          <div className={c.labelsRight}>
            <div className={clsx(c.labelText, c.statCell)}>UT</div>
            <div className={clsx(c.labelText, c.statCell)}>GR</div>
            <div className={clsx(c.labelText, c.statCell)}>B</div>
          </div>
        </div>
        <div>
          {group.teams?.map((team, i) => (
            <div key={team.id} className={c.teamRow}>
              <div className={c.teamRowLeft}>
                <div className={clsx(c.text, c.mr26)}>{i + 1}</div>
                <img
                  className={c.logo}
                  src={team.logoUrl ?? undefined}
                  alt={team.name}
                />
                <div className={clsx(c.text, c.teamName)}>{team.name}</div>
              </div>
              <div className={c.teamRowRight}>
                <div className={clsx(c.text, c.statCell)}>
                  {team.numberOfMatchesPlayed}
                </div>
                <div className={clsx(c.text, c.statCell)}>
                  {team.goalDifference}
                </div>
                <div className={clsx(c.text, c.statCell)}>{team.teamScore}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
