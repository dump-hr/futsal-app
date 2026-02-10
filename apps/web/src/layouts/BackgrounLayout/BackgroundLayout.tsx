import type { PropsWithChildren } from 'react';
import BackgroundImage from '@assets/logo_mlnm.png';
import c from './BackgroundLayout.module.scss';

export const BackgroundLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={c.layout}
      style={{
        backgroundImage: `url(${BackgroundImage})`,
      }}>
      {children}
    </div>
  );
};
