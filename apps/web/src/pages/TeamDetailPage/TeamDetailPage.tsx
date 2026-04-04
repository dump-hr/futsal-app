import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { MatchDto } from '@futsal-app/types';
import {
  Button,
  ButtonSmall,
  ModalConfirmation,
  TeamFormModal,
  PlayerList,
} from '@components/index';
import { MatchInfo, MATCH_STATUS, MATCH_STAGE } from '@components/MatchInfo';
import type { MatchStage, MatchStatus } from '@components/MatchInfo';
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

const MATCH_TYPE_TO_STAGE: Record<string, MatchStage> = {
  group: MATCH_STAGE.GROUP_STAGE,
  quarterFinal: MATCH_STAGE.QUARTER_FINALS,
  semiFinal: MATCH_STAGE.SEMI_FINALS,
  final: MATCH_STAGE.FINAL,
  thirdPlace: MATCH_STAGE.FINAL,
};

const getMatchStatus = (match: MatchDto): MatchStatus => {
  if (match.isActive) return MATCH_STATUS.LIVE;
  if (match.homeGoals > 0 || match.awayGoals > 0) return MATCH_STATUS.FINISHED;
  const matchTime = new Date(match.timeOfMatch);
  return matchTime < new Date() ? MATCH_STATUS.FINISHED : MATCH_STATUS.UPCOMING;
};

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
            {(!matches || matches.length === 0) && (
              <span className={c.matchPlaceholder}>
                Još nema utakmica za ovu ekipu
              </span>
            )}
            {matches?.map((match) => (
              <MatchInfo
                key={match.id}
                teamA={{
                  teamName: match.homeTeam?.name ?? 'TBD',
                  logoUrl: match.homeTeam?.logoUrl ?? '',
                }}
                teamB={{
                  teamName: match.awayTeam?.name ?? 'TBD',
                  logoUrl: match.awayTeam?.logoUrl ?? '',
                }}
                teamAScore={match.homeGoals}
                teamBScore={match.awayGoals}
                matchTime={new Date(match.timeOfMatch).toLocaleTimeString('hr', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                matchStage={MATCH_TYPE_TO_STAGE[match.matchType] ?? MATCH_STAGE.GROUP_STAGE}
                matchStatus={getMatchStatus(match)}
              />
            ))}
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