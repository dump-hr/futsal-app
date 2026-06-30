import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import clsx from 'clsx';
import { routes } from '@routes/index';
import { Logo, MenuWhite, XWhite } from '@assets/index';
import c from './Navbar.module.scss';

const navLinks = [
  { to: routes.HOME, label: 'Početna' },
  { to: routes.GROUPS, label: 'Skupine' },
  { to: routes.DRAW, label: 'Ždrijeb' },
  { to: routes.MATCHES, label: 'Utakmice' },
  { to: routes.TEAMS, label: 'Ekipe' },
];

export const Navbar = () => {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <nav className={c.navbar}>
      <Link to={routes.HOME} className={c.logoWrapper}>
        <img src={Logo} alt='Logo' />
      </Link>

      <ul className={c.desktopList}>
        {navLinks.map(({ to, label }) => (
          <li key={to}>
            <Link to={to} className={location === to ? c.active : ''}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <button
        type='button'
        className={c.menuButton}
        aria-label='Otvori izbornik'
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}>
        <img src={MenuWhite} alt='' />
      </button>

      <div
        className={clsx(c.overlay, { [c.overlayOpen]: isOpen })}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <aside
        className={clsx(c.drawer, { [c.drawerOpen]: isOpen })}
        role='dialog'
        aria-modal='true'
        aria-hidden={!isOpen}>
        <button
          type='button'
          className={c.closeButton}
          aria-label='Zatvori izbornik'
          onClick={() => setIsOpen(false)}>
          <img src={XWhite} alt='' />
        </button>

        <ul className={c.drawerList}>
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={location === to ? c.active : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </nav>
  );
};
