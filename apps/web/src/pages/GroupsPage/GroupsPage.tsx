import { useState } from 'react';
import { Button, Group, ModalConfirmation, Input } from '@components/index';
import { PlusBlack, CheckBlack, XWhite, TrashCanBlack } from '@assets/index';
import {
  useGroupsGet,
  useGroupCreate,
  useGroupDelete,
  useGroupRemoveTeam,
  useGroupAddTeam,
} from '@api/group';
import { useTournamentsGet } from '@api/tournament';
import { useTeamsGet } from '@api/team';
import c from './GroupsPage.module.scss';
import toast from 'react-hot-toast';

export const GroupsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [deleteGroupId, setDeleteGroupId] = useState<number | null>(null);
  const [addTeamGroupId, setAddTeamGroupId] = useState<number | null>(null);

  const { data: groups = [] } = useGroupsGet();
  const { data: tournaments = [] } = useTournamentsGet();
  // TODO: get tournamentId from global state (selected tournament) instead of assuming the first one
  const tournamentId = tournaments[0]?.id ?? 1;
  const { data: allTeams = [] } = useTeamsGet(tournamentId);

  const { mutate: createGroup, isPending: isCreating } = useGroupCreate();
  const { mutate: deleteGroup } = useGroupDelete();
  const { mutate: removeTeam } = useGroupRemoveTeam();
  const { mutate: addTeam } = useGroupAddTeam();

  const unassignedTeams = allTeams.filter((t) => !t.groupId);

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !tournamentId) {
      toast.error('Potrebno je unijeti ime skupine i imati odabrani turnir.');
      return;
    }

    const doesGroupExist = groups.some(
      (g) => g.name.toLowerCase() === newGroupName.trim().toLowerCase(),
    );

    if (doesGroupExist) {
      toast.error('Skupina s tim imenom već postoji.');
      return;
    }

    createGroup(
      { name: newGroupName.trim(), tournamentId },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewGroupName('');
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteGroupId) return;
    deleteGroup(deleteGroupId, {
      onSuccess: () => setDeleteGroupId(null),
    });
  };

  const handleAddTeam = (teamId: number) => {
    if (!addTeamGroupId) return;
    addTeam(
      { id: addTeamGroupId, dto: { teamId } },
      { onSuccess: () => setAddTeamGroupId(null) },
    );
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
                onAddTeam={() => setAddTeamGroupId(group.id)}
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
        <div
          className={c.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setNewGroupName('');
            }
          }}>
          <div className={c.modal}>
            <h3 className={c.modalTitle}>Nova skupina</h3>
            <Input
              label='Ime skupine'
              placeholder='Skupina A'
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
            />
            <div className={c.modalButtons}>
              <Button
                icon={XWhite}
                variant='secondary'
                onClick={() => {
                  setShowCreateModal(false);
                  setNewGroupName('');
                }}>
                Odustani
              </Button>
              <Button
                icon={CheckBlack}
                variant='primary'
                onClick={handleCreateGroup}
                disabled={isCreating || !newGroupName.trim()}>
                Potvrdi
              </Button>
            </div>
          </div>
        </div>
      )}

      {addTeamGroupId !== null && (
        <div
          className={c.overlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setAddTeamGroupId(null);
          }}>
          <div className={c.modal}>
            <h3 className={c.modalTitle}>Dodaj ekipu u skupinu</h3>
            <div className={c.teamPills}>
              {unassignedTeams.length === 0 ? (
                <p className={c.emptyText}>Nema neraspoređenih ekipa.</p>
              ) : (
                unassignedTeams.map((team) => (
                  <Button
                    key={team.id}
                    icon={team.logoUrl ?? ''}
                    variant='gray'
                    onClick={() => handleAddTeam(team.id)}>
                    {team.name}
                  </Button>
                ))
              )}
            </div>
            <div className={c.modalButtons}>
              <Button
                icon={XWhite}
                variant='secondary'
                onClick={() => setAddTeamGroupId(null)}>
                Odustani
              </Button>
            </div>
          </div>
        </div>
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
    </div>
  );
};
