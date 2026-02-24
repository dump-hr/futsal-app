import { searchWhite } from 'assets/icons';
import styles from './Search.module.scss';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function Search({ className, value, onChange }: SearchProps) {
  return (
    <div className={`${styles.search} ${className}`}>
      <input
        type="text"
        placeholder="Pretraži"
        value={value}
        onChange={onChange}
      />
      <img src={searchWhite} alt="search" className={styles.search__icon} />
    </div>
  );
}

export default Search;
