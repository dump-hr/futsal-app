import { useState, useMemo } from 'react';
import { Button, FilterDropdown, TeamFormModal, TeamsTable, ModalConfirmation } from '@components/index';
import { PlusBlack, TrashCanBlack } from '@assets/icons';
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
  const [formModal, setFormModal] = useState<{
    open: boolean;
    teamId?: number;
  }>({ open: false });

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
        <Button
          icon={PlusBlack}
          variant='primary'
          onClick={() => setFormModal({ open: true })}>
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

      <TeamsTable
        teams={filteredTeams}
        onDelete={setTeamToDelete}
        onEdit={(teamId) => setFormModal({ open: true, teamId })}
      />

      {formModal.open && (
        <TeamFormModal
          teamId={formModal.teamId}
          onClose={() => setFormModal({ open: false })}
        />
      )}

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
