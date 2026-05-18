import { Navbar } from '@components/Navbar';
import type { ReactNode } from 'react';
import c from './NavbarLayout.module.scss';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className={c.content}>{children}</main>
    </>
  );
};
