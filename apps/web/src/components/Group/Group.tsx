import {
  PlusBlack,
  TrashCanGray,
  TrashCanWhite,
  LockGray,
} from '@assets/index';
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
};

const Group: React.FC<GroupProps> = ({
  groupTitle,
  teams,
  onDelete,
  onAddTeam,
  onRemoveTeam,
}) => {
  return (
    <section className={c.group}>
      <div className={c.groupTitleWrapper}>
        <span className={c.groupTitle}>{groupTitle}</span>
        <ButtonSmall iconSrc={TrashCanGray} hasBorder={true} onClick={onDelete} />
      </div>

      <div className={c.groupTeams}>
        {teams.map((team, index) => (
          <div key={index} className={c.team}>
            <div>
              <img src={team.logo} alt={team.name} />
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

        <ButtonSmall iconSrc={LockGray} hasBorder={true} />
      </div>
    </section>
  );
};

export default Group;
