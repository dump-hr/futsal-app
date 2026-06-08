import { useState } from 'react';
import {
  Button,
  Group,
  ModalConfirmation,
  ModalAddChoice,
  ModalNewGroup,
  ModalAddTeamToGroup,
  TeamFormModal,
} from '@components/index';
import { PlusBlack, TrashCanBlack } from '@assets/index';
import {
  useGroupsGetByTournamentId,
  useGroupDelete,
  useGroupRemoveTeam,
  useGroupAddTeam,
} from '@api/group';
import { useTeamsGet } from '@api/team';
import { useTournamentContext } from '@hooks/index';
import c from './GroupsPage.module.scss';

export const GroupsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [addChoiceGroupId, setAddChoiceGroupId] = useState<number | null>(null);
  const [addTeamGroupId, setAddTeamGroupId] = useState<number | null>(null);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);

  const tournamentId = useTournamentContext();
  const { data: groups = [] } = useGroupsGetByTournamentId(tournamentId);
  const { data: allTeams = [] } = useTeamsGet(tournamentId);

  const { mutate: deleteGroup } = useGroupDelete();
  const { mutate: removeTeam } = useGroupRemoveTeam();
  const { mutate: addTeam } = useGroupAddTeam();

  const unassignedTeams = allTeams.filter((t) => !t.groupId);

  const handleConfirmDelete = () => {
    if (!deleteGroupId) return;
    deleteGroup(deleteGroupId, {
      onSuccess: () => setDeleteGroupId(null),
    });
  };

  const deleteGroupName =
    groups.find((g) => g.id === deleteGroupId)?.name ?? '';

  return (
    <div className={c.page}>
      <div className={c.header}>
        <h2 className={c.title}>SKUPINE</h2>
        <Button
          icon={PlusBlack}
          variant='primary'
          onClick={() => setShowCreateModal(true)}>
          Dodaj skupinu
        </Button>
      </div>

      <div className={c.content}>
        <div className={c.leftPanel}>
          <p className={c.unassignedLabel}>
            Neraspoređene ekipe ({unassignedTeams.length})
          </p>
          <div className={c.teamPills}>
            {unassignedTeams.map((team) => (
              <Button
                key={team.id}
                icon={team.logoUrl ?? ''}
                variant='gray'
                draggable
                className={c.draggableTeam}
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/team-id', String(team.id));
                  e.dataTransfer.effectAllowed = 'move';
                }}>
                {team.name}
              </Button>
            ))}
          </div>
        </div>

        {groups.length === 0 ? (
          <div className={c.emptyState}>
            <p className={c.emptyText}>Nema dodanih skupina.</p>
          </div>
        ) : (
          <div className={c.groups}>
            {groups.map((group) => (
              <Group
                key={group.id}
                groupTitle={group.name}
                teams={(group.teams ?? []).map((t) => ({
                  id: t.id,
                  name: t.name,
                  logo: t.logoUrl ?? '',
                }))}
                onDelete={() => setDeleteGroupId(group.id)}
                onAddTeam={() => setAddChoiceGroupId(group.id)}
                onRemoveTeam={(teamId) => removeTeam({ id: group.id, teamId })}
                onDropTeam={(teamId) =>
                  addTeam({ id: group.id, dto: { teamId } })
                }
              />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <ModalNewGroup
          tournamentId={tournamentId}
          existingGroupNames={groups.map((g) => g.name)}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {addChoiceGroupId !== null && (
        <ModalAddChoice
          title='Što želite dodati?'
          primaryLabel='Dodaj novu ekipu'
          secondaryLabel='Dodaj postojeću ekipu'
          onPrimary={() => {
            setShowCreateTeamModal(true);
            setAddChoiceGroupId(null);
          }}
          onSecondary={() => {
            setAddTeamGroupId(addChoiceGroupId);
            setAddChoiceGroupId(null);
          }}
          onCancel={() => setAddChoiceGroupId(null)}
        />
      )}

      {addTeamGroupId !== null && (
        <ModalAddTeamToGroup
          groupId={addTeamGroupId}
          unassignedTeams={unassignedTeams}
          onClose={() => setAddTeamGroupId(null)}
        />
      )}

      {deleteGroupId !== null && (
        <ModalConfirmation
          description='Ovim postupkom izbrisat ćete'
          boldText={deleteGroupName}
          icon={TrashCanBlack}
          circleVariant='gray'
          onCancel={() => setDeleteGroupId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showCreateTeamModal && (
        <TeamFormModal onClose={() => setShowCreateTeamModal(false)} />
      )}
    </div>
  );
};
