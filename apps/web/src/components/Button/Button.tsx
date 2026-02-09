import styles from './Button.module.scss';

type ButtonVariant = 'primary' | 'secondary' | 'green';

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
    <button
      className={`${styles.button} ${styles[variant]} ${className || ''}`}
      {...props}>
      <div className={styles.iconWrapper}>
        <img src={icon} alt='' className={styles.icon} />
      </div>
      <span className={styles.label}>{children}</span>
    </button>
  );
};

export default Button;
