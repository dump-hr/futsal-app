import { useState, useMemo } from 'react';
import { Button, FilterDropdown, TeamInfo } from '@components/index';
import { PlusBlack } from '@assets/icons';
import { useTeamsGet } from '@api/team/useTeamsGet';
import c from './TeamsPage.module.scss';

//TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

type SortOrder = 'az' | 'za';
type GroupFilter = 'all' | 'A' | 'B' | 'C' | 'D';

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Abecedno (A do Z)', value: 'az' },
  { label: 'Abecedno (Z do A)', value: 'za' },
];

const GROUP_OPTIONS: { label: string; value: GroupFilter }[] = [
  { label: 'Skupina', value: 'all' },
  { label: 'Skupina A', value: 'A' },
  { label: 'Skupina B', value: 'B' },
  { label: 'Skupina C', value: 'C' },
  { label: 'Skupina D', value: 'D' },
];

export const TeamsPage = () => {
  const { data: teams } = useTeamsGet(TOURNAMENT_ID);
  const [sortOrder, setSortOrder] = useState<SortOrder>('az');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all');

  const filteredTeams = useMemo(() => {
    if (!teams) return [];

    let result = [...teams];

    if (groupFilter !== 'all') {
      result = result.filter((team) => team.group === groupFilter);
    }

    result.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'hr');
      return sortOrder === 'az' ? cmp : -cmp;
    });

    return result;
  }, [teams, sortOrder, groupFilter]);

  return (
    <div className={c.page}>
      <div className={c.header}>
        <h1 className={c.title}>EKIPE</h1>
        <Button icon={PlusBlack} variant='primary'>
          Nova ekipa
        </Button>
      </div>

      <div className={c.filters}>
        <span className={c.filterLabel}>Filtriraj</span>
        <div className={c.filterDropdowns}>
          <FilterDropdown
            value={sortOrder}
            options={SORT_OPTIONS}
            onChange={setSortOrder}
          />
          <FilterDropdown
            value={groupFilter}
            options={GROUP_OPTIONS}
            onChange={setGroupFilter}
          />
        </div>
      </div>

      <div className={c.teamListSection}>
        <div className={c.columnHeaders}>
          <span>Naziv</span>
          <div className={c.columnStats}>
            <span className={c.colHeader}>Broj bodova</span>
            <span className={c.colHeader}>Skupina</span>
            <span className={c.colHeader}>Broj igrača</span>
            <span className={c.colHeader}>Broj utakmica</span>
          </div>
        </div>

        <div className={c.teamList}>
          {filteredTeams.map((team) => (
            <TeamInfo
              key={team.id}
              teamName={team.name}
              teamLogoUrl={team.logoUrl ?? ''}
              teamScore={0}
              teamGroup={team.group ?? '-'}
              numberOfPlayers={0}
              numberOfMatchesPlayed={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
