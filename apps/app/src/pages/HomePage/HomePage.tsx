import c from './HomePage.module.scss';
import { Button, EventCard, NoEventsCard } from '@components/index';

export const HomePage = () => {
  return (
    <div className={c.page}>
      <section className={c.section}>
        <div className={c.row}>
          <Button variant='primary'>Nova utakmica</Button>
          <Button variant='secondary'>Više</Button>
        </div>
      </section>

      <section className={c.section}>
        <div className={c.row}>
          <EventCard eventType='goal' playerName='Ivo Jovanović' minute={12} />
          <EventCard
            eventType='ownGoal'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='redCard'
            playerName='Ivo Jovanović'
            minute={12}
          />
          <EventCard
            eventType='yellowCard'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='penaltyGoal'
            playerName='Ivo Jovanović'
            minute={12}
          />
          <EventCard
            eventType='penaltyMiss'
            playerName='Ivo Jovanović'
            minute={12}
            side='right'
          />
          <EventCard
            eventType='injury'
            playerName='Ivo Jovanović'
            minute={12}
          />
        </div>
      </section>

      <section className={c.section}>
        <div className={c.row}>
          <NoEventsCard />
        </div>
      </section>
    </div>
  );
};
