import { SearchWhite } from '@assets/icons';
import c from './Search.module.scss';
import { ChangeEvent } from 'react';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Search = ({ className, value, onChange }: SearchProps) => {
  return (
    <div className={`${c.search} ${className}`}>
      <input
        type='text'
        placeholder='Pretraži'
        value={value}
        onChange={onChange}
      />
      <img src={SearchWhite} alt='search' className={c.search__icon} />
    </div>
  );
};

export default Search;
