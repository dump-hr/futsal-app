import { useLocation } from 'wouter';
import { Button } from '@components/index';
import { GoalLime } from '@assets/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const [, navigate] = useLocation();

  return (
    <PageLayout title='404'>
      <div className={c.container}>
        <div className={c.scene}>
          <img className={c.ball} src={GoalLime} alt='' />
          <span className={c.shadow} />
        </div>
        <h2 className={c.heading}>Promašaj!</h2>
        <p className={c.message}>Stranica koju tražiš ne postoji.</p>
        <Button variant='primary' onClick={() => navigate(routes.HOME)}>
          Natrag na početnu
        </Button>
      </div>
    </PageLayout>
  );
};
