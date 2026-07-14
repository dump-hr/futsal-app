import { Link } from 'wouter';
import { Skeleton, Team } from '@components/index';
import { useTeamsGet } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import c from './TeamsPage.module.scss';

export const TeamsPage = () => {
  const tournamentId = useTournamentContext();
  const { data: teams, isLoading, isError } = useTeamsGet(tournamentId);

  const renderContent = () => {
    if (isLoading)
      return (
        <div className={c.grid}>
          <Skeleton count={8} className={c.skeletonTeam} />
        </div>
      );
    if (isError)
      return <p className={c.message}>Greška pri učitavanju ekipa</p>;
    if (!teams?.length) return <p className={c.message}>Nema ekipa</p>;

    return (
      <div className={c.grid}>
        {teams.map((team) => (
          <Link
            key={team.id}
            href={`${routes.TEAMS}/${team.id}`}
            className={c.cardLink}>
            <Team team={{ name: team.name, logoUrl: team.logoUrl ?? undefined }} />
          </Link>
        ))}
      </div>
    );
  };

  return <PageLayout title='Ekipe'>{renderContent()}</PageLayout>;
};
