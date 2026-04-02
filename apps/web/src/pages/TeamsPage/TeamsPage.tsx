import { useState, useMemo } from 'react';
import { Button, FilterDropdown, TeamInfo } from '@components/index';
import ModalConfirmation from '@components/ModalConfirmation/ModalConfirmation';
import { PlusBlack, TrashCanBlack, TrashCanGray } from '@assets/icons';
import { useTeamsGet } from '@api/team/useTeamsGet';
import { useTeamDelete } from '@api/team/useTeamDelete';
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
  const { mutate: deleteTeam } = useTeamDelete();
  const [sortOrder, setSortOrder] = useState<SortOrder>('az');
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all');
  const [teamToDelete, setTeamToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
              teamScore={team.teamScore ?? 0}
              teamGroup={team.group ?? '-'}
              numberOfPlayers={team.numberOfPlayers ?? 0}
              numberOfMatchesPlayed={team.numberOfMatchesPlayed ?? 0}
              onDelete={() =>
                setTeamToDelete({ id: team.id, name: team.name })
              }
            />
          ))}
        </div>
      </div>

      {teamToDelete && (
        <ModalConfirmation
          description='Želite obrisati ekipu'
          boldText={teamToDelete.name}
          icon={TrashCanBlack}
          circleVariant='gray'
          onCancel={() => setTeamToDelete(null)}
          onConfirm={() => {
            deleteTeam(teamToDelete.id);
            setTeamToDelete(null);
          }}
        />
      )}
    </div>
  );
};
