import clsx from 'clsx';
import c from './TeamLogo.module.scss';

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
  className?: string;
};

export const TeamLogo: React.FC<TeamLogoProps> = ({
  name,
  logoUrl,
  className,
}) =>
  logoUrl ? (
    <img className={clsx(c.logo, className)} src={logoUrl} alt={name} />
  ) : (
    <span className={clsx(c.logo, c.fallback, className)} aria-label={name}>
      {name.charAt(0)}
    </span>
  );
