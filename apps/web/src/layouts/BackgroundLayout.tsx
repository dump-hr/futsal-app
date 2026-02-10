import type { PropsWithChildren } from 'react';
import BackgroundImage from '@assets/pozadina_mlnm.png';

export const BackgroundLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      {children}
    </div>
  );
};
