import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import {
  Button,
  ButtonSmall,
  ModalConfirmation,
  TeamFormModal,
  PlayerList,
  MatchList,
} from '@components/index';
import PlayerFormModal from '@components/TeamFormModal/PlayerFormModal';
import {
  ArrowLeftGray,
  PlusBlack,
  PencilGray,
  TrashCanBlack,
} from '@assets/icons';
import { useTeamGet } from '@api/team';
import { useMatchGetByTeam } from '@api/match';
import { usePlayerCreate, usePlayerUpdate, usePlayerDelete } from '@api/player';
import { routes } from '@routes/index';
import { PlayerModalAdd, PlayerModalEditById } from '@types';
import c from './TeamDetailPage.module.scss';

type PlayerModal = PlayerModalAdd | PlayerModalEditById;

export const TeamDetailPage = () => {
  const [, navigate] = useLocation();
  const params = useParams<{ teamId: string }>();
  const parsed = Number(params.teamId);
  const teamId = isNaN(parsed) ? undefined : parsed;

  const { data: team } = useTeamGet(teamId);
  const { data: matches } = useMatchGetByTeam(teamId!);
  const { mutate: createPlayer } = usePlayerCreate();
  const { mutate: updatePlayer } = usePlayerUpdate();
  const { mutate: deletePlayer } = usePlayerDelete();

  const [playerModal, setPlayerModal] = useState<PlayerModal | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showTeamEdit, setShowTeamEdit] = useState(false);

  if (!teamId) return null;

  const handlePlayerSave = (firstName: string, lastName: string) => {
    if (playerModal?.type === 'edit') {
      updatePlayer({ id: playerModal.playerId, dto: { firstName, lastName } });
    } else {
      createPlayer({ firstName, lastName, teamId });
    }
    setPlayerModal(null);
  };

  const players = team?.players ?? [];

  return (
    <div className={c.page}>
      <div className={c.header}>
        <ButtonSmall
          iconSrc={ArrowLeftGray}
          onClick={() => navigate(routes.TEAMS)}
          hasBorder
        />
        <div className={c.teamIdentity}>
          {team?.logoUrl && (
            <img src={team.logoUrl} alt={team.name} className={c.teamLogo} />
          )}
          <h1 className={c.teamName}>{team?.name}</h1>
        </div>
        <ButtonSmall
          iconSrc={PencilGray}
          onClick={() => setShowTeamEdit(true)}
          hasBorder
        />
      </div>

      <div className={c.content}>
        <section className={c.playersSection}>
          <div className={c.sectionHeader}>
            <span className={c.sectionTitle}>Igrači</span>
            <Button
              icon={PlusBlack}
              variant='primary'
              onClick={() => setPlayerModal({ type: 'add' })}>
              Dodaj igrača
            </Button>
          </div>

          <div className={c.playerList}>
            <PlayerList
              players={players}
              onEdit={(player) =>
                setPlayerModal({
                  type: 'edit',
                  playerId: player.id,
                  firstName: player.firstName,
                  lastName: player.lastName,
                })
              }
              onDelete={(player) =>
                setPlayerToDelete({
                  id: player.id,
                  name: `${player.firstName} ${player.lastName}`,
                })
              }
            />
          </div>
        </section>

        <section className={c.matchesSection}>
          <span className={c.sectionTitle}>Utakmice</span>
          <div className={c.matchList}>
            <MatchList matches={matches ?? []} />
          </div>
        </section>
      </div>

      {playerModal && (
        <PlayerFormModal
          firstName={
            playerModal.type === 'edit' ? playerModal.firstName : undefined
          }
          lastName={
            playerModal.type === 'edit' ? playerModal.lastName : undefined
          }
          onSave={handlePlayerSave}
          onClose={() => setPlayerModal(null)}
        />
      )}

      {playerToDelete && (
        <ModalConfirmation
          description='Želite obrisati igrača'
          boldText={playerToDelete.name}
          icon={TrashCanBlack}
          circleVariant='gray'
          onCancel={() => setPlayerToDelete(null)}
          onConfirm={() => {
            deletePlayer(playerToDelete.id);
            setPlayerToDelete(null);
          }}
        />
      )}

      {showTeamEdit && (
        <TeamFormModal teamId={teamId} onClose={() => setShowTeamEdit(false)} />
      )}
    </div>
  );
};
