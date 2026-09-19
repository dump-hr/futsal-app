import { useId, useRef } from 'react';
import clsx from 'clsx';
import c from './Input.module.scss';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: boolean;
  prefixLabel?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefixLabel,
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

  const input = (
    <input
      ref={inputRef}
      id={inputId}
      type='text'
      className={clsx(c.input, error && c.error, prefixLabel && c.withPrefix)}
      autoComplete={autoComplete}
      {...props}
      onKeyDown={handleKeyDown}
    />
  );

  return (
    <div className={c.inputContainer}>
      {label && (
        <label htmlFor={inputId} className={c.label}>
          {label}
        </label>
      )}
      {prefixLabel ? (
        <div className={clsx(c.prefixedInput, error && c.error)}>
          <label htmlFor={inputId} className={c.prefix}>
            {prefixLabel}
          </label>
          {input}
        </div>
      ) : (
        input
      )}
    </div>
  );
};
