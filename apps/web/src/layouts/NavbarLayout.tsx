import { Navbar } from '@components/index';
import type { ReactNode } from 'react';

export const NavbarLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80 }}>{children}</div>
    </>
  );
};
