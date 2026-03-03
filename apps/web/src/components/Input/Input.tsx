import { useId, useRef } from 'react';
import c from './Input.module.scss';
import { useCloseComponent } from '@hooks/index';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
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
        className={c.input}
        {...props}
      />
    </div>
  );
};

export default Input;
