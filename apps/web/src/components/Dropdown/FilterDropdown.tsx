import clsx from 'clsx';
import { ArrowDownWhite } from '@assets/index';
import c from './Dropdown.module.scss';

type FilterDropdownProps = {
  label: string;
  className?: string;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  className,
}) => {
  return (
    <div className={clsx(c.filterWrapper, className)}>
      <div className={c.filterTrigger}>
        <span className={c.selectedText}>{label}</span>
        <img
          src={ArrowDownWhite}
          alt='arrow down'
          className={c.arrowIcon}
        />
      </div>
    </div>
  );
};

export default FilterDropdown;
