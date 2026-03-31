import { Link, useLocation } from 'wouter';
import { routes } from '@routes/routes';
import { ExitBlack, Logo } from '@assets/icons';
import ButtonSmall from '@components/ButtonSmall';
import { BackgroundColor } from '../../types';
import c from './Navbar.module.scss';

export const Navbar = () => {
  const [location, navigate] = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate(routes.LOGIN);
  };

  return (
    <nav className={c.navbar}>
      <div className={c.listWrapper}>
        <div className={c.imageWrapper}>
          <img src={Logo} alt='Logo' />
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

      <ButtonSmall
        iconSrc={ExitBlack}
        backgroundColor={BackgroundColor.White}
        onClick={handleLogout}
      />
    </nav>
  );
};
