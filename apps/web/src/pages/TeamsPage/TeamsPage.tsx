import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Button,
  FilterDropdown,
  TeamFormModal,
  TeamsTable,
  ModalConfirmation,
} from '@components/index';
import { PlusBlack, TrashCanBlack } from '@assets/icons';
import { useTeamsGet, useTeamDelete } from '@api/team';
import { useGroupsGetByTournamentId } from '@api/group';
import c from './TeamsPage.module.scss';
import { SortOrder, GroupFilter, SORT_OPTIONS } from './options';
import { useTournamentContext } from '@hooks/index';

export const TeamsPage = () => {
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
  const [, navigate] = useLocation();

  const TOURNAMENT_ID = useTournamentContext();

  const { data: teams } = useTeamsGet(TOURNAMENT_ID);
  const { data: groups } = useGroupsGetByTournamentId(TOURNAMENT_ID);
  const { mutate: deleteTeam } = useTeamDelete();

  const groupFilterOptions: { label: string; value: GroupFilter }[] = [
    { label: 'Skupina', value: 'all' },
    ...(groups?.map((g) => ({
      label: `Skupina ${g.name}`,
      value: String(g.id),
    })) ?? []),
  ];

  const filteredTeams = teams
    ? [...teams]
        .filter(
          (team) =>
            groupFilter === 'all' ||
            (team.groupId != null && String(team.groupId) === groupFilter),
        )
        .sort((a, b) => {
          const cmp = a.name.localeCompare(b.name, 'hr');
          return sortOrder === 'az' ? cmp : -cmp;
        })
    : [];

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
            options={groupFilterOptions}
            onChange={setGroupFilter}
          />
        </div>
      </div>

      <TeamsTable
        teams={filteredTeams}
        onDelete={setTeamToDelete}
        onEdit={(teamId) => setFormModal({ open: true, teamId })}
        onRowClick={(teamId) => navigate(`/admin/teams/${teamId}`)}
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
