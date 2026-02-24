import { SearchWhite } from '@assets/icons';
import c from './Search.module.scss';
import { ChangeEvent } from 'react';
import clsx from 'clsx';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Search: React.FC<SearchProps> = ({ className, value, onChange }) => {
  return (
    <div className={clsx(c.search, className)}>
      <input
        type='text'
        placeholder='Pretraži'
        value={value}
        onChange={onChange}
      />
      <img src={SearchWhite} alt='search' className={c.searchIcon} />
    </div>
  );
};

export default Search;
