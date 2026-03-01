import { useId } from 'react';
import c from './Input.module.scss';
import { BorderColor } from 'types/borderColor';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  borderColor: BorderColor;
}

const Input: React.FC<InputProps> = ({ label, borderColor, ...props }) => {
  const inputId = useId();

  return (
    <div className={c.inputContainer}>
      {label && (
        <label htmlFor={inputId} className={c.label}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type='text'
        className={c.input}
        style={{ border: `0.5px solid ${borderColor}` }}
        {...props}
      />
    </div>
  );
};

export default Input;
