import { useState } from 'react';
import clsx from 'clsx';
import { PlusBlack, TrashCanGray, TrashCanWhite } from '@assets/index';
import c from './Group.module.scss';
import { Button, ButtonSmall } from '@components/index';

type Team = {
  id?: number;
  name: string;
  logo: string;
};

type GroupProps = {
  groupTitle: string;
  teams: Team[];
  onDelete?: () => void;
  onAddTeam?: () => void;
  onRemoveTeam?: (teamId: number) => void;
  onDropTeam?: (teamId: number) => void;
};

const Group: React.FC<GroupProps> = ({
  groupTitle,
  teams,
  onDelete,
  onAddTeam,
  onRemoveTeam,
  onDropTeam,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (!onDropTeam) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const teamId = Number(e.dataTransfer.getData('text/team-id'));
    if (Number.isFinite(teamId) && teamId > 0) onDropTeam?.(teamId);
  };

  return (
    <section
      className={clsx(c.group, isDragOver && c.dragOver)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}>
      <div className={c.groupTitleWrapper}>
        <span className={c.groupTitle}>{groupTitle}</span>
        <ButtonSmall
          iconSrc={TrashCanGray}
          hasBorder={true}
          onClick={onDelete}
        />
      </div>

      <div className={c.groupTeams}>
        {teams.map((team, index) => (
          <div key={index} className={c.team}>
            <div>
              <img src={team.logo || undefined} alt={team.name} />
              <span>{team.name}</span>
            </div>

            <ButtonSmall
              iconSrc={TrashCanWhite}
              onClick={() => team.id !== undefined && onRemoveTeam?.(team.id)}
            />
          </div>
        ))}
      </div>

      <div className={c.groupFooter}>
        <Button icon={PlusBlack} variant='primary' onClick={onAddTeam}>
          Dodaj ekipu
        </Button>
      </div>
    </section>
  );
};

export default Group;
