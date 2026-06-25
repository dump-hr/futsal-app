import type { ReactNode } from 'react';
import c from './PageLayout.module.scss';

type PageLayoutProps = {
  title: ReactNode;
  children: ReactNode;
};

export const PageLayout = ({ title, children }: PageLayoutProps) => {
  return (
    <div className={c.page}>
      {typeof title === 'string' ? (
        <h1 className={c.title}>{title}</h1>
      ) : (
        title
      )}
      <div className={c.panel}>{children}</div>
    </div>
  );
};
