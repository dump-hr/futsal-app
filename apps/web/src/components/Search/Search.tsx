import { SearchWhite } from '@assets/icons';
import styles from './Search.module.scss';
import { ChangeEvent } from 'react';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Search = ({ className, value, onChange }: SearchProps) => {
  return (
    <div className={`${styles.search} ${className}`}>
      <input
        type='text'
        placeholder='Pretraži'
        value={value}
        onChange={onChange}
      />
      <img src={SearchWhite} alt='search' className={styles.search__icon} />
    </div>
  );
};

export default Search;
