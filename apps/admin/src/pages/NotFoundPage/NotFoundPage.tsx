import { useLocation } from 'wouter';
import { Button } from '@components/index';
import { GoalLime, ArrowLeftGray } from '@assets/index';
import { routes } from '@routes/index';
import c from './NotFoundPage.module.scss';

export const NotFoundPage = () => {
  const [, navigate] = useLocation();

  return (
    <div className={c.page}>
      <div className={c.scene}>
        <img className={c.ball} src={GoalLime} alt='' />
        <span className={c.shadow} />
      </div>
      <h1 className={c.code}>404</h1>
      <h2 className={c.heading}>Promašaj!</h2>
      <p className={c.message}>Stranica koju tražiš ne postoji.</p>
      <Button
        icon={ArrowLeftGray}
        variant='secondary'
        onClick={() => navigate(routes.ADMIN_HOME)}>
        Natrag na početnu
      </Button>
    </div>
  );
};
