import { useState } from 'react';
import { Filter, Group, type FilterOption } from '@components/index';
import { useGroupsGetByTournamentId } from '@api/index';
import { useTournamentContext } from '@hooks/index';
import { PageLayout } from '@layouts/index';
import c from './GroupsPage.module.scss';

export const GroupsPage = () => {
  const [groupName, setGroupName] = useState<string | null>(null);
  const tournamentId = useTournamentContext();

  const { data: groups, isLoading, isError } = useGroupsGetByTournamentId(tournamentId);

  const groupOptions: FilterOption<string>[] = (groups ?? [])
    .map((g) => ({ label: `Skupina ${g.name}`, value: g.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const visibleGroups = (groups ?? [])
    .filter((g) => (groupName ? g.name === groupName : true))
    .sort((a, b) => a.name.localeCompare(b.name));

  const renderContent = () => {
    if (isLoading) return <p className={c.message}>Učitavanje…</p>;
    if (isError) return <p className={c.message}>Greška pri učitavanju skupina</p>;
    if (visibleGroups.length === 0) return <p className={c.message}>Nema skupina</p>;

    return (
      <div className={c.groups}>
        {visibleGroups.map((group) => (
          <Group key={group.id} group={group} />
        ))}
      </div>
    );
  };

  return (
    <PageLayout title='Skupine'>
      <div className={c.filters}>
        <Filter
          label='Skupina'
          value={groupName}
          options={groupOptions}
          onChange={setGroupName}
        />
      </div>

      {renderContent()}
    </PageLayout>
  );
};
