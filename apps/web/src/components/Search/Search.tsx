import { SearchWhite } from '@assets/icons';
import c from './Search.module.scss';
import { ChangeEvent, useRef } from 'react';
import clsx from 'clsx';
import { useCloseComponent } from '@hooks/useCloseComponent';

type SearchProps = {
  className?: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const Search: React.FC<SearchProps> = ({ className, value, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const removeFocus = () => {
    inputRef.current?.blur();
  };

  useCloseComponent({ onClose: removeFocus });

  return (
    <div className={clsx(c.search, className)}>
      <input
        type='text'
        placeholder='Pretraži'
        value={value}
        onChange={onChange}
        ref={inputRef}
      />
      <img src={SearchWhite} alt='search' className={c.searchIcon} />
    </div>
  );
};
