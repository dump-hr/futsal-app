import { SearchWhite } from '@assets/index';
import c from './Search.module.scss';
import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Search: React.FC<SearchProps> = ({ className, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      e.stopPropagation();
    }
  };

  return (
    <div className={clsx(c.search, className)}>
      <input
        type='text'
        placeholder='Pretraži'
        value={value}
        onChange={onChange}
        ref={inputRef}
        onKeyDown={handleKeyDown}
      />
      <img src={SearchWhite} alt='search' className={c.searchIcon} />
    </div>
  );
};
