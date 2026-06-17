import c from './HomePage.module.scss';
import { Button } from '@components/index';

export const HomePage = () => {
  return (
    <div className={c.page}>
      <section className={c.section}>
        <div className={c.row}>
          <Button variant='primary'>Nova utakmica nova utakmica</Button>
          <Button variant='secondary'>Više</Button>
        </div>
      </section>
    </div>
  );
};
