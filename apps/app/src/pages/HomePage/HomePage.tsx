import { useLocation } from 'wouter';
import { Button, MatchCard, MatchCardLarge } from '@components/index';
import { useMatchGetAll, useMatchTimerLive } from '@api/index';
import { getTodayMatches, getUpcomingAndLiveMatches } from '@helpers/index';
import { useTournamentContext, useDragScroll } from '@hooks/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './HomePage.module.scss';

export const HomePage = () => {
  const [, navigate] = useLocation();
  const tournamentId = useTournamentContext();

  const { data: matches, isLoading, isError } = useMatchGetAll(tournamentId);

  const activeMatch = matches?.find((match) => match.isActive);
  const { elapsedSeconds } = useMatchTimerLive(activeMatch?.id ?? 0);
  const liveElapsedMinutes = Math.floor(elapsedSeconds / 60);
  const elapsedFor = (id: number) =>
    id === activeMatch?.id ? liveElapsedMinutes : undefined;

  const todayRowRef = useDragScroll<HTMLDivElement>();

  const todayMatches = getTodayMatches(matches);
  const upcomingMatches = getUpcomingAndLiveMatches(matches);

  const renderToday = () => {
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isError)
      return <p className={c.message}>Greška pri učitavanju utakmica</p>;
    if (todayMatches.length === 0)
      return (
        <div className={c.empty}>
          <p className={c.emptyText}>Danas nema utakmica</p>
          <Button variant='primary' onClick={() => navigate(routes.MATCHES)}>
            Pregledaj utakmice
          </Button>
        </div>
      );

    return (
      <div className={c.todayRow} ref={todayRowRef}>
        {todayMatches.map((match) => (
          <MatchCardLarge
            key={match.id}
            match={match}
            elapsedMinutes={elapsedFor(match.id)}
          />
        ))}
      </div>
    );
  };

  const renderUpcoming = () => {
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isError)
      return <p className={c.message}>Greška pri učitavanju utakmica</p>;
    if (upcomingMatches.length === 0)
      return <p className={c.message}>Nema utakmica</p>;

    return (
      <div className={c.list}>
        {upcomingMatches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            elapsedMinutes={elapsedFor(match.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <PageLayout title='Dobrodošli!'>
      <section className={c.section}>
        <h2 className={c.sectionTitle}>Današnje utakmice</h2>
        {renderToday()}
      </section>

      <section className={c.section}>
        <div className={c.sectionHeader}>
          <h2 className={c.sectionTitle}>Utakmice</h2>
          <Button
            variant='primary'
            className={c.viseButton}
            onClick={() => navigate(routes.MATCHES)}>
            Više
          </Button>
        </div>
        {renderUpcoming()}
      </section>
    </PageLayout>
  );
};
