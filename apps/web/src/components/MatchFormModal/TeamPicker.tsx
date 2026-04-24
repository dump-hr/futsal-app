import { FilterDropdown } from '@components/index';
import { TeamDto } from '@futsal-app/types';
import c from './MatchFormModal.module.scss';

type TeamPickerProps = {
  label: string;
  team: TeamDto | undefined;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
};

const TeamPicker: React.FC<TeamPickerProps> = ({
  label,
  team,
  value,
  options,
  onChange,
}) => {
  return (
    <div className={c.teamPicker}>
      <div className={c.teamPreview}>
        <div className={c.logoBox}>
          {team?.logoUrl ? (
            <img src={team.logoUrl} className={c.logoImage} alt={team.name} />
          ) : (
            <span className={c.logoText}>LOGO</span>
          )}
        </div>
        <span className={c.teamLabel}>{team?.name ?? label}</span>
      </div>
      <div className={c.dropdownWrap}>
        <FilterDropdown
          value={value}
          options={options}
          onChange={onChange}
          variant='default'
          placeholder='Odaberi ekipu'
        />
      </div>
    </div>
  );
};

export default TeamPicker;
