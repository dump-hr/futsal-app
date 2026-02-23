import { ButtonSmall } from '@components/index';
import { XBlack } from '@assets/index';
import { BackgroundColor } from '../../types';
import c from './MatchPanel.module.scss';

type Team = {
  id: number;
  name: string;
  logoUrl?: string;
};

type TeamPickerProps = {
  homeTeam: Team;
  awayTeam: Team;
  onPick: (teamId: number, isHome: boolean) => void;
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
        <button
          className={c.teamOption}
          onClick={() => onPick(homeTeam.id, true)}>
          {homeTeam.logoUrl && (
            <img
              src={homeTeam.logoUrl}
              alt={homeTeam.name}
              className={c.teamLogo}
            />
          )}
          <p className={c.teamName}>{homeTeam.name}</p>
        </button>
        <p className={c.vsLabel}>VS</p>
        <button
          className={c.teamOption}
          onClick={() => onPick(awayTeam.id, false)}>
          {awayTeam.logoUrl && (
            <img
              src={awayTeam.logoUrl}
              alt={awayTeam.name}
              className={c.teamLogo}
            />
          )}
          <p className={c.teamName}>{awayTeam.name}</p>
        </button>
      </div>
    </div>
  );
};

export default TeamPicker;
