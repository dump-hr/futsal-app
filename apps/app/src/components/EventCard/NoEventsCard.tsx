import c from './NoEventsCard.module.scss';
import { WhistleWhite } from '@assets/index';

export const NoEventsCard = () => {
  return (
    <div className={c.card}>
      <img src={WhistleWhite} alt='' aria-hidden className={c.icon} />
      <p className={c.text}>Utakmica još nije počela!</p>
    </div>
  );
};
