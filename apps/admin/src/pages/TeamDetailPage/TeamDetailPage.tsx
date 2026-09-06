import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import {
  Button,
  ButtonSmall,
  MatchPanel,
  ModalConfirmation,
  TeamFormModal,
  PlayerFormModal,
  PlayerList,
  MatchList,
  TeamLogo,
} from '@components/index';
import {
  ArrowLeftGray,
  PlusBlack,
  PencilGray,
  PlayBlack,
  TrashCanBlack,
} from '@assets/index';
import {
  useTeamGet,
  useMatchGetByTeam,
  useMatchDelete,
  useMatchSetActive,
  usePlayerCreate,
  usePlayerUpdate,
  usePlayerDelete,
} from '@api/index';
import { routes } from '@routes/index';
import { PlayerModalAdd, PlayerModalEditById } from '@types';
import c from './TeamDetailPage.module.scss';

type PlayerModal = PlayerModalAdd | PlayerModalEditById;

export const TeamDetailPage = () => {
  const [playerModal, setPlayerModal] = useState<PlayerModal | null>(null);
  const [playerToDelete, setPlayerToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [showTeamEdit, setShowTeamEdit] = useState(false);
  const [panelMatchId, setPanelMatchId] = useState<number | undefined>();
  const [panelClosing, setPanelClosing] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<number | undefined>();
  const [matchToActivate, setMatchToActivate] = useState<number | undefined>();
  const [, navigate] = useLocation();

  const params = useParams<{ teamId: string }>();
  const parsed = Number(params.teamId);
  const teamId = isNaN(parsed) ? undefined : parsed;

  const { data: team } = useTeamGet(teamId);
  const { data: matches } = useMatchGetByTeam(teamId!);
  const { mutate: createPlayer } = usePlayerCreate();
  const { mutate: updatePlayer } = usePlayerUpdate();
  const { mutate: deletePlayer } = usePlayerDelete();
  const { mutate: deleteMatch } = useMatchDelete();
  const { mutate: setMatchActive } = useMatchSetActive();

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
          <TeamLogo
            name={team?.name ?? ''}
            logoUrl={team?.logoUrl}
            className={c.teamLogo}
          />
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
            <MatchList
              matches={matches ?? []}
              onEdit={setPanelMatchId}
              onDelete={setMatchToDelete}
              onActivate={setMatchToActivate}
              onTimer={(matchId) =>
                navigate(
                  routes.MATCH_TIMER.replace(':matchId', String(matchId)),
                )
              }
            />
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
          description='Ovim postupkom izbrisat ćete igrača'
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

      {matchToDelete !== undefined && (
        <ModalConfirmation
          description='Jeste li sigurni da želite obrisati utakmicu?'
          boldText='Ova radnja se ne može poništiti.'
          icon={TrashCanBlack}
          circleVariant='gray'
          onCancel={() => setMatchToDelete(undefined)}
          onConfirm={() => {
            deleteMatch(matchToDelete);
            setMatchToDelete(undefined);
          }}
        />
      )}

      {matchToActivate !== undefined && (
        <ModalConfirmation
          description='Želite li aktivirati utakmicu?'
          boldText='Utakmica će postati aktivna.'
          icon={PlayBlack}
          circleVariant='green'
          onCancel={() => setMatchToActivate(undefined)}
          onConfirm={() => {
            setMatchActive(matchToActivate);
            setMatchToActivate(undefined);
          }}
        />
      )}

      {panelMatchId !== undefined && (
        <div
          className={
            panelClosing ? `${c.panelOverlay} ${c.closing}` : c.panelOverlay
          }
          onAnimationEnd={(e) => {
            if (e.target === e.currentTarget && panelClosing) {
              setPanelMatchId(undefined);
              setPanelClosing(false);
            }
          }}>
          <MatchPanel
            matchId={panelMatchId}
            onClose={() => setPanelClosing(true)}
          />
        </div>
      )}
    </div>
  );
};
