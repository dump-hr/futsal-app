import { Link } from 'wouter';
import { useTopScorersGet } from '@api/index';
import { Skeleton } from '@components/index';
import { useTournamentId } from '@hooks/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './StatsPage.module.scss';

const TOP_SCORERS_LIMIT = 10;

export const StatsPage = () => {
  const tournamentId = useTournamentId();
  const {
    data: players,
    isLoading,
    isError,
  } = useTopScorersGet(tournamentId, TOP_SCORERS_LIMIT);

  const renderContent = () => {
    if (isLoading)
      return <Skeleton count={TOP_SCORERS_LIMIT} className={c.skeletonRow} />;
    if (isError)
      return <p className={c.message}>Greška pri učitavanju strijelaca</p>;
    if (!players?.length) return <p className={c.message}>Nema strijelaca</p>;

    return (
      <table className={c.table}>
        <caption>Najbolji strijelci</caption>
        <colgroup>
          <col className={c.rankColumn} />
          <col className={c.nameColumn} />
          <col className={c.teamColumn} />
          <col className={c.goalsColumn} />
        </colgroup>
        <thead>
          <tr>
            <th scope='col'>#</th>
            <th scope='col'>Ime</th>
            <th scope='col'>Ekipa</th>
            <th scope='col'>Golovi</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={player.id}>
              <td className={c.rank}>{index + 1}</td>
              <td>
                {player.firstName} {player.lastName}
              </td>
              <td>
                {player.team ? (
                  <Link href={`${routes.TEAMS}/${player.team.id}`}>
                    {player.team.name}
                  </Link>
                ) : (
                  '—'
                )}
              </td>
              <td className={c.goals}>{player.goals ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <PageLayout title='Statistika'>
      <div className={c.content}>{renderContent()}</div>
    </PageLayout>
  );
};
