import clsx from 'clsx';
import c from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'green' | 'gray';

type ButtonProps = {
  children: React.ReactNode;
  icon: string;
  variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = 'primary',
  className,
  ...props
}) => {
  return (
    <button className={clsx(c.button, c[variant], className)} {...props}>
      <div className={c.iconWrapper}>
        <img src={icon} alt='' className={c.icon} />
      </div>
      <span className={c.label}>{children}</span>
    </button>
  );
};

export default Button;
