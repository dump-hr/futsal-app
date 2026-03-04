import {
  PlusBlack,
  TrashCanGray,
  TrashCanWhite,
  LockGray,
} from '@assets/index';
import c from './Group.module.scss';
import { Button, ButtonSmall } from '@components/index';

type Team = {
  name: string;
  logo: string;
};

type GroupProps = {
  groupTitle: string;
  teams: Team[];
};

const Group: React.FC<GroupProps> = ({ groupTitle, teams }) => {
  return (
    <section className={c.group}>
      <div className={c.groupTitleWrapper}>
        <span className={c.groupTitle}>{groupTitle}</span>
        <ButtonSmall iconSrc={TrashCanGray} hasBorder={true} />
      </div>

      <div className={c.groupTeams}>
        {teams.map((team, index) => (
          <div key={index} className={c.team}>
            <div>
              <img src={team.logo} alt={team.name} />
              <span>{team.name}</span>
            </div>

            <ButtonSmall iconSrc={TrashCanWhite} />
          </div>
        ))}
      </div>

      <div className={c.groupFooter}>
        <Button icon={PlusBlack} variant='primary'>
          Dodaj ekipu
        </Button>

        <ButtonSmall iconSrc={LockGray} hasBorder={true} />
      </div>
    </section>
  );
};

export default Group;
