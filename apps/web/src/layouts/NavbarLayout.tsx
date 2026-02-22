import { Navbar } from '@components/index';
import type { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
