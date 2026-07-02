import { Button, Modal } from '@components/index';
import { XWhite } from '@assets/index';
import { useGroupAddTeam } from '@api/index';
import { TeamDto } from '@futsal-app/types';
import c from './ModalAddTeamToGroup.module.scss';

type ModalAddTeamToGroupProps = {
  groupId: number;
  unassignedTeams: TeamDto[];
  onClose: () => void;
};

export const ModalAddTeamToGroup: React.FC<ModalAddTeamToGroupProps> = ({
  groupId,
  unassignedTeams,
  onClose,
}) => {
  const { mutate: addTeam, isPending } = useGroupAddTeam();

  const handleAddTeam = (teamId: number) => {
    addTeam({ id: groupId, dto: { teamId } }, { onSuccess: onClose });
  };

  return (
    <Modal
      title='Dodaj ekipu u skupinu'
      subtitle='Odaberi neraspoređenu ekipu'
      onClose={onClose}>
      <div className={c.teamPills}>
        {unassignedTeams.length === 0 ? (
          <p className={c.emptyText}>Nema neraspoređenih ekipa.</p>
        ) : (
          unassignedTeams.map((team) => (
            <Button
              key={team.id}
              icon={team.logoUrl ?? ''}
              variant='gray'
              disabled={isPending}
              onClick={() => handleAddTeam(team.id)}>
              {team.name}
            </Button>
          ))
        )}
      </div>

      <div className={c.buttons}>
        <Button icon={XWhite} variant='secondary' onClick={onClose}>
          Odustani
        </Button>
      </div>
    </Modal>
  );
};
