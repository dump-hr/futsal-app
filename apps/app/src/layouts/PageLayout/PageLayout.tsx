import type { ReactNode } from 'react';
import c from './PageLayout.module.scss';

type PageLayoutProps = {
  title: string;
  children: ReactNode;
};

export const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <div className={c.page}>
      <h1 className={c.title}>{title}</h1>
      <div className={c.panel}>{children}</div>
    </div>
  );
};
