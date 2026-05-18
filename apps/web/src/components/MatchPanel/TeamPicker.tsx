import { ButtonSmall } from '@components/ButtonSmall';
import { XBlack } from '@assets/icons';
import { BackgroundColor } from '@types';
import c from './MatchPanel.module.scss';

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

export const TeamPicker: React.FC<TeamPickerProps> = ({
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
          {homeTeam.logoUrl ? (
            <img
              src={homeTeam.logoUrl}
              alt={homeTeam.name}
              className={c.teamLogo}
            />
          ) : (
            <div className={c.teamLogoFallback} aria-label={homeTeam.name}>
              {homeTeam.name.charAt(0)}
            </div>
          )}
          <p className={c.teamName}>{homeTeam.name}</p>
        </button>
        <p className={c.vsLabel}>VS</p>
        <button className={c.teamOption} onClick={() => onPick(false)}>
          {awayTeam.logoUrl ? (
            <img
              src={awayTeam.logoUrl}
              alt={awayTeam.name}
              className={c.teamLogo}
            />
          ) : (
            <div className={c.teamLogoFallback} aria-label={awayTeam.name}>
              {awayTeam.name.charAt(0)}
            </div>
          )}
          <p className={c.teamName}>{awayTeam.name}</p>
        </button>
      </div>
    </div>
  );
};
