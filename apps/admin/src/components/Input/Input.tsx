import { useId, useRef } from 'react';
import c from './Input.module.scss';
import { useCloseComponent } from '@hooks/index';

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

  const removeFocus = () => {
    inputRef.current?.blur();
  };

  useCloseComponent({ onClose: removeFocus });

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
      />
    </div>
  );
};
