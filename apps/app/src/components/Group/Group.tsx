import clsx from 'clsx';
import c from './Group.module.scss';
import { GroupDto } from '@futsal-app/types';
import { TeamRow } from './TeamRow';

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
            <TeamRow key={team.id} team={team} position={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};
