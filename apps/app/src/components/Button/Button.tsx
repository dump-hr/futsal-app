import clsx from 'clsx';
import c from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button className={clsx(c.button, c[variant], className)} {...props}>
      {children}
    </button>
  );
};
