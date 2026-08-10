import { Button } from '@components/index';
import { GoalLime } from '@assets/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './ErrorPage.module.scss';

export const ErrorPage = () => {
  return (
    <div className={c.background}>
      <PageLayout title='Ups!'>
        <div className={c.container}>
          <div className={c.scene}>
            <img className={c.ball} src={GoalLime} alt='' />
            <span className={c.shadow} />
          </div>
          <h2 className={c.heading}>Prekid igre!</h2>
          <p className={c.message}>
            Nešto je pošlo po zlu. Pokušaj ponovno ili se vrati na početnu.
          </p>
          <div className={c.actions}>
            <Button variant='primary' onClick={() => window.location.reload()}>
              Pokušaj ponovno
            </Button>
            <Button
              variant='secondary'
              onClick={() => {
                window.location.href = routes.HOME;
              }}>
              Natrag na početnu
            </Button>
          </div>
        </div>
      </PageLayout>
    </div>
  );
};
