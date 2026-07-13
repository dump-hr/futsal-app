import { useId, useRef } from 'react';
import c from './Input.module.scss';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  autoComplete = 'off',
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputId = useId();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    props.onKeyDown?.(e);
    if (e.key === 'Escape') {
      inputRef.current?.blur();
      e.stopPropagation();
    }
  };

  return (
    <div className={c.inputContainer}>
      {label && (
        <label htmlFor={inputId} className={c.label}>
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        id={inputId}
        type='text'
        className={error ? `${c.input} ${c.error}` : c.input}
        autoComplete={autoComplete}
        {...props}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
