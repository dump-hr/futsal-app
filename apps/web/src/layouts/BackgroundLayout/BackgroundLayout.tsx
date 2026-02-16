import type { PropsWithChildren } from 'react';
import c from './BackgroundLayout.module.scss';

export const BackgroundLayout = ({ children }: PropsWithChildren) => {
  return <div className={c.layout}>{children}</div>;
};
