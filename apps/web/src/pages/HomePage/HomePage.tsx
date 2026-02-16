import ButtonSmall, { BackgroundColor } from '../../components/ButtonSmall';
import { Button, MATCH_STAGE, MATCH_STATUS, MatchInfo } from '../../components';
import c from './HomePage.module.scss';
import trashCanSvg from '@assets/icons/trash-can-gray.svg';
import plusSvg from '@assets/icons/plus-gray.svg';
import { PlusBlack, XWhite, CheckBlack } from '@assets/index';
import infobipLogo from '../../../public/test-logos/infobip.png';
import otpLogo from '../../../public/test-logos/otp.png';

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

      <div style={{ width: '1296px' }}>
        <MatchInfo
          teamA={{ teamName: 'Ericsson Nikola Tesla', logoUrl: otpLogo }}
          teamB={{ teamName: 'Maurer Electronics', logoUrl: infobipLogo }}
          matchTime={'21:30'}
          teamAScore={3}
          teamBScore={1}
          matchStage={MATCH_STAGE.QUARTER_FINALS}
          matchStatus={MATCH_STATUS.LIVE}
        />
      </div>
    </div>
  );
};
