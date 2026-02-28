import {
  PlusBlack,
  TrashCanGray,
  LockGray,
  EricssonLogo,
  InfobipLogo,
  EndavaLogo,
  OtpBankaLogo,
} from '@assets/index';
import c from './Group.module.scss';
import { Button, ButtonSmall } from '@components/index';

const groupTitle = 'Skupina A';
const teams = [
  { name: 'Ericsson Nikola Tesla', logo: EricssonLogo },
  { name: 'Infobip', logo: InfobipLogo },
  { name: 'Endava', logo: EndavaLogo },
  { name: 'OTP Banka', logo: OtpBankaLogo },
];

export const Group = () => {
  return (
    <section className={c.group}>
      <div className={c.groupTitle}>
        <span>{groupTitle}</span>
        <ButtonSmall iconSrc={TrashCanGray} />
      </div>

      <div className={c.groupTeams}>
        {teams.map((team, index) => (
          <div key={index} className={c.team}>
            <div>
              <img src={team.logo} alt={team.name} />
              <span>{team.name}</span>
            </div>

            <ButtonSmall iconSrc={TrashCanGray} />
          </div>
        ))}
      </div>

      <div>
        <Button icon={PlusBlack} variant='primary'>
          Dodaj ekipu
        </Button>

        <ButtonSmall iconSrc={LockGray} hasBorder={true} />
      </div>
    </section>
  );
};
