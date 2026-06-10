import { CheckBlack, PlusBlack } from '@assets/index';
import { Button } from '@components/index';
import c from './MatchTimerPage.module.scss';

type ShootoutViewProps = {
  homeShootoutGoals: number;
  awayShootoutGoals: number;
  onOpenNewEvent: () => void;
  onEndMatch: () => void;
};

export const ShootoutView: React.FC<ShootoutViewProps> = ({
  homeShootoutGoals,
  awayShootoutGoals,
  onOpenNewEvent,
  onEndMatch,
}) => {
  return (
    <div className={c.timerSection}>
      <h1 className={c.shootoutTitle}>Kazneni udarci</h1>
      <div className={c.shootoutScore}>
        {homeShootoutGoals} - {awayShootoutGoals}
      </div>

      <div className={c.actions}>
        <Button icon={PlusBlack} variant='primary' onClick={onOpenNewEvent}>
          Novi penal
        </Button>
        <Button icon={CheckBlack} variant='primary' onClick={onEndMatch}>
          Kraj utakmice
        </Button>
      </div>

      <div className={c.legend}>
        <span className={c.legendItem}>
          <span className={c.legendKey}>G</span>
          <span className={c.legendLabel}>POGODAK</span>
        </span>
        <span className={c.legendItem}>
          <span className={c.legendKey}>P</span>
          <span className={c.legendLabel}>PROMAŠAJ</span>
        </span>
      </div>
    </div>
  );
};
