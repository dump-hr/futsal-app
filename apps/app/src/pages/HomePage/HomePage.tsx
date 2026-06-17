import c from './HomePage.module.scss';
import { EventCard } from '@components/index';

export const HomePage = () => {
  return (
    <div className={c.page}>
      <section className={c.section}>
        <h2 className={c.title}>EventCard</h2>
        <div className={c.row}>
          <EventCard eventType='goal' playerName='Ivo Jovanović' minute={12} />
          <EventCard eventType='ownGoal' playerName='Ivo Jovanović' minute={12} side='right' />
          <EventCard eventType='redCard' playerName='Ivo Jovanović' minute={12} />
          <EventCard eventType='yellowCard' playerName='Ivo Jovanović' minute={12} side='right' />
          <EventCard eventType='penaltyGoal' playerName='Ivo Jovanović' minute={12} />
          <EventCard eventType='penaltyMiss' playerName='Ivo Jovanović' minute={12} side='right' />
          <EventCard eventType='injury' playerName='Ivo Jovanović' minute={12} />
        </div>
      </section>
    </div>
  );
};
