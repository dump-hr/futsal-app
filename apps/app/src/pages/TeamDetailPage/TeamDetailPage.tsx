import { Fragment } from 'react';
import { Link, useParams } from 'wouter';
import { MatchCard, MatchCardLarge, TeamPlayersTable } from '@components/index';
import { useTeamGet, useMatchGetByTeam } from '@api/index';
import { PageLayout } from '@layouts/index';
import { routes } from '@routes/index';
import { ArrowLeftLime } from '@assets/index';
import c from './TeamDetailPage.module.scss';

export const TeamDetailPage = () => {
  const params = useParams<{ teamId: string }>();
  const parsed = Number(params.teamId);
  const teamId = Number.isNaN(parsed) ? undefined : parsed;

  const { data: team, isLoading: isTeamLoading } = useTeamGet(teamId);
  const {
    data: matches,
    isLoading: areMatchesLoading,
    isError: isMatchesError,
  } = useMatchGetByTeam(teamId);

  if (!teamId) return null;

  const header = (
    <div className={c.header}>
      <Link href={routes.TEAMS} className={c.backButton} aria-label='Natrag'>
        <img className={c.backIcon} src={ArrowLeftLime} alt='' />
      </Link>
      <div className={c.identity}>
        {team?.logoUrl ? (
          <img className={c.logo} src={team.logoUrl} alt='' />
        ) : (
          <span className={c.logoFallback} aria-hidden>
            {team?.name?.charAt(0)}
          </span>
        )}
        <h1 className={c.name}>{team?.name}</h1>
      </div>
    </div>
  );

  const renderPlayers = () => {
    if (isTeamLoading) return <p className={c.message}>Učitavanje…</p>;
    if (!team?.players?.length)
      return <p className={c.message}>Nema igrača</p>;
    return <TeamPlayersTable players={team.players} />;
  };

  const renderMatches = () => {
    if (areMatchesLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isMatchesError)
      return <p className={c.message}>Greška pri učitavanju utakmica</p>;
    if (!matches?.length) return <p className={c.message}>Nema utakmica</p>;
    return (
      <div className={c.matchList}>
        {matches.map((match) => (
          <Fragment key={match.id}>
            <div className={c.matchCompact}>
              <Link
                href={`${routes.MATCHES}/${match.id}`}
                className={c.matchLink}>
                <MatchCard match={match} />
              </Link>
            </div>
            <div className={c.matchLarge}>
              <Link
                href={`${routes.MATCHES}/${match.id}`}
                className={c.matchLink}>
                <MatchCardLarge match={match} />
              </Link>
            </div>
          </Fragment>
        ))}
      </div>
    );
  };

  return (
    <PageLayout title={header}>
      <div className={c.content}>
        <section className={c.playersSection}>{renderPlayers()}</section>
        <section className={c.matchesSection}>
          <h2 className={c.matchesTitle}>Utakmice</h2>
          {renderMatches()}
        </section>
      </div>
    </PageLayout>
  );
};
