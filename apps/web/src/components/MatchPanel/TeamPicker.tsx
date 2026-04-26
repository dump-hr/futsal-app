import { ButtonSmall } from '@components/index';
import { XBlack } from '@assets/index';
import { BackgroundColor } from '@types';
import c from './MatchPanel.module.scss';

const HOME_LOGO_TEST = '/test-logos/infobip.png';
const AWAY_LOGO_TEST = '/test-logos/otp.png';

type Team = {
  name: string;
  logoUrl?: string | null;
};

type TeamPickerProps = {
  homeTeam: Team;
  awayTeam: Team;
  onPick: (isHome: boolean) => void;
  onClose: () => void;
};

const TeamPicker: React.FC<TeamPickerProps> = ({
  homeTeam,
  awayTeam,
  onPick,
  onClose,
}) => {
  return (
    <div className={c.teamPicker}>
      <div className={c.teamPickerHeader}>
        <p className={c.teamPickerTitle}>ODABERI EKIPU</p>
        <div onClick={onClose}>
          <ButtonSmall
            iconSrc={XBlack}
            backgroundColor={BackgroundColor.White}
          />
        </div>
      </div>
      <div className={c.teamPickerTeams}>
        <button className={c.teamOption} onClick={() => onPick(true)}>
          <img
            src={homeTeam.logoUrl || HOME_LOGO_TEST}
            alt={homeTeam.name}
            className={c.teamLogo}
          />
          <p className={c.teamName}>{homeTeam.name}</p>
        </button>
        <p className={c.vsLabel}>VS</p>
        <button className={c.teamOption} onClick={() => onPick(false)}>
          <img
            src={awayTeam.logoUrl || AWAY_LOGO_TEST}
            alt={awayTeam.name}
            className={c.teamLogo}
          />
          <p className={c.teamName}>{awayTeam.name}</p>
        </button>
      </div>
    </div>
  );
};

export default TeamPicker;
