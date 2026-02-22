import ButtonSmall, { BackgroundColor } from '../components/ButtonSmall';
import { Button, TeamInfo } from '../components';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';
import { PlusBlack, XWhite, CheckBlack } from '@assets/index';

export const HomePage = () => {
  return (
    <div
      style={{
        background: 'black',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
      <h1 className={c.a}>Title 1</h1>
      <h1 className={c.b}>Title 1</h1>
      <h1 className={c.c}>Title 1</h1>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Button icon={PlusBlack} variant='primary'>
          Nova utakmica
        </Button>
        <Button icon={XWhite} variant='secondary'>
          Odustani
        </Button>
        <Button icon={CheckBlack} variant='green'>
          Potvrdi
        </Button>
      </div>

      <ButtonSmall
        iconSrc={trashCanSvg}
        hasBorder
        backgroundColor={BackgroundColor.Lime}
      />
      <ButtonSmall
        iconSrc={plusSvg}
        width={40}
        backgroundColor={BackgroundColor.Red}
      />

      <TeamInfo
        teamName='Infobip'
        teamLogoUrl='/team-logo.png'
        teamScore={3}
        teamGroup='A'
        numberOfPlayers={12}
        numberOfMatchesPlayed={4}
      />
    </div>
  );
};
