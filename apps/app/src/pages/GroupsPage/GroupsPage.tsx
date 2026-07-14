import { Group, Skeleton } from '@components/index';
import { useGroupsGetByTournamentId } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { PageLayout } from '@layouts/index';
import c from './GroupsPage.module.scss';

export const GroupsPage = () => {
  const tournamentId = useTournamentContext();

  const {
    data: groups,
    isLoading,
    isError,
  } = useGroupsGetByTournamentId(tournamentId);

  const renderContent = () => {
    if (isLoading)
      return (
        <div className={c.groups}>
          <Skeleton count={4} className={c.skeletonGroup} />
        </div>
      );
    if (isError)
      return <p className={c.message}>Greška pri učitavanju skupina</p>;
    if (groups?.length === 0) return <p className={c.message}>Nema skupina</p>;

    return (
      <div className={c.groups}>
        {groups?.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </div>
    );
  };

  return <PageLayout title='Skupine'>{renderContent()}</PageLayout>;
};
