import { Link, useLocation } from 'wouter';
import { routes } from '@routes/routes';
import { Logout, Logotip } from '@assets/icons';
import ButtonSmall, { BackgroundColor } from '@components/ButtonSmall';
import c from './Navbar.module.scss';

export const Navbar = () => {
  const [location] = useLocation();

  return (
    <nav className={c.navbar}>
      <div className={c.listWrapper}>
        <div className={c.imageWrapper}>
          <img src={Logotip} alt='Logo' />
        </div>

        <ul className={c.navbarList}>
          <Link
            to={routes.ADMIN}
            className={location === routes.ADMIN ? c.active : ''}>
            Početna
          </Link>
          <Link
            to={routes.TEAMS}
            className={location === routes.TEAMS ? c.active : ''}>
            Ekipe
          </Link>
          <Link
            to={routes.GROUPS}
            className={location === routes.GROUPS ? c.active : ''}>
            Skupine
          </Link>
          <Link
            to={routes.MATCHES}
            className={location === routes.MATCHES ? c.active : ''}>
            Utakmice
          </Link>
        </ul>
      </div>

      <ButtonSmall iconSrc={Logout} backgroundColor={BackgroundColor.White} />
    </nav>
  );
};
