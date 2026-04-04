import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Button, FilterDropdown, ButtonSmall, Input } from '@components/index';
import { useCloseComponent } from '@hooks/index';
import {
  PlusBlack,
  XWhite,
  CheckBlack,
  UploadGray,
  TrashCanGray,
  XGray,
} from '@assets/icons';
import { useTeamGet, useTeamCreate, useTeamUpdate } from '@api/team';
import { useGroupsGet } from '@api/group';
import { usePlayerCreate, usePlayerDelete, usePlayerUpdate } from '@api/player';
import {
  BackgroundColor,
  PlayerModalAdd,
  PlayerModalEditByIndex,
} from '@types';
import { validatePlayers } from '@helpers/validatePlayers';
import { GroupOption } from '@constants/groupOptions';
import PlayerFormModal from './PlayerFormModal';
import common from './ModalCommon.module.scss';
import c from './TeamFormModal.module.scss';

type PlayerEntry = {
  id?: number;
  firstName: string;
  lastName: string;
};

//TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

type PlayerModal = PlayerModalAdd | PlayerModalEditByIndex;

type TeamFormModalProps = {
  teamId?: number;
  onClose: () => void;
};

const TeamFormModal: React.FC<TeamFormModalProps> = ({ teamId, onClose }) => {
  const isEdit = teamId !== undefined;
  const { data: existingTeam } = useTeamGet(teamId);
  const { mutateAsync: createTeam } = useTeamCreate();
  const { mutateAsync: updateTeam } = useTeamUpdate();
  const { mutateAsync: createPlayer } = usePlayerCreate();
  const { mutateAsync: deletePlayer } = usePlayerDelete();
  const { mutateAsync: updatePlayer } = usePlayerUpdate();
  const { data: groups } = useGroupsGet();

  const groupOptions = useMemo(() => {
    const opts: { label: string; value: GroupOption }[] = [
      { label: 'Bez skupine', value: 'none' },
    ];
    if (groups) {
      for (const g of groups) {
        opts.push({ label: `Skupina ${g.name}`, value: String(g.id) });
      }
    }
    return opts;
  }, [groups]);

  const ready = !isEdit || !!existingTeam;

  const [teamName, setTeamName] = useState('');
  const [group, setGroup] = useState<GroupOption>('none');
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [originalPlayerIds, setOriginalPlayerIds] = useState<number[]>([]);
  const [playerModal, setPlayerModal] = useState<PlayerModal | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (existingTeam && isEdit && !initialized) {
      setTeamName(existingTeam.name);
      setGroup(existingTeam.groupId ? String(existingTeam.groupId) : 'none');
      const existingPlayers: PlayerEntry[] = (existingTeam.players ?? []).map(
        (p: PlayerEntry) => ({
          id: p.id,
          firstName: p.firstName,
          lastName: p.lastName,
        }),
      );
      setPlayers(existingPlayers);
      setOriginalPlayerIds(existingPlayers.map((p) => p.id!));
      setInitialized(true);
    }
  }, [existingTeam, isEdit, initialized]);

  const handleClose = useCallback(() => onClose(), [onClose]);
  useCloseComponent({ onClose: handleClose });

  const handlePlayerSave = (firstName: string, lastName: string) => {
    if (playerModal?.type === 'add') {
      setPlayers([...players, { firstName, lastName }]);
    } else if (playerModal?.type === 'edit') {
      const updated = [...players];
      updated[playerModal.index] = {
        ...updated[playerModal.index],
        firstName,
        lastName,
      };
      setPlayers(updated);
    }
    setPlayerModal(null);
  };

  const handleSave = async () => {
    if (!teamName.trim()) {
      toast.error('Unesite ime ekipe');
      return;
    }
    if (!validatePlayers(players)) return;

    setIsSaving(true);

    try {
      if (isEdit) {
        await updateTeam({
          id: teamId,
          dto: {
            name: teamName,
            groupId: group === 'none' ? null : Number(group),
          },
        });

        const currentPlayerIds = players.filter((p) => p.id).map((p) => p.id!);
        const removedIds = originalPlayerIds.filter(
          (id) => !currentPlayerIds.includes(id),
        );

        for (const id of removedIds) {
          await deletePlayer(id);
        }

        for (const player of players) {
          if (player.id) {
            const original = existingTeam?.players?.find(
              (p: PlayerEntry) => p.id === player.id,
            );
            if (
              original &&
              (original.firstName !== player.firstName ||
                original.lastName !== player.lastName)
            ) {
              await updatePlayer({
                id: player.id,
                dto: {
                  firstName: player.firstName,
                  lastName: player.lastName,
                },
              });
            }
          } else {
            await createPlayer({
              firstName: player.firstName,
              lastName: player.lastName,
              teamId,
            });
          }
        }
      } else {
        const created = await createTeam({
          name: teamName,
          groupId: group === 'none' ? undefined : Number(group),
          tournamentId: TOURNAMENT_ID,
        });

        for (const player of players) {
          await createPlayer({
            firstName: player.firstName,
            lastName: player.lastName,
            teamId: created.id,
          });
        }
      }

      onClose();
    } catch {
      // Errors are handled by individual hook onError toasts
    } finally {
      setIsSaving(false);
    }
  };

  if (!ready || (isEdit && !initialized)) return null;

  return (
    <div
      className={`${common.overlay} ${c.overlay}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}>
      <div className={c.modal} role='dialog' aria-modal='true'>
        <div className={c.scrollContent}>
          <div className={common.header}>
            <div className={common.headerText}>
              <h1 className={common.title}>
                {isEdit ? 'Uredi ekipu' : 'Nova ekipa'}
              </h1>
              <p className={common.subtitle}>
                {isEdit
                  ? 'Uredi ime, promjeni logo, unesi nove igrače, uredi već postojeće igrače'
                  : 'Kreiraj ime, importaj logo i unesi igrače nove ekipe'}
              </p>
            </div>
            <ButtonSmall iconSrc={XGray} onClick={onClose} hasBorder />
          </div>

          <div className={c.main}>
            <div className={c.teamInfoSection}>
              <div className={c.logoArea}>
                <div className={c.logoPlaceholder}>
                  {isEdit && existingTeam?.logoUrl ? (
                    <img
                      src={existingTeam.logoUrl}
                      alt={teamName}
                      className={c.logoImage}
                    />
                  ) : (
                    <span className={c.logoText}>LOGO</span>
                  )}
                </div>
                <div className={c.logoActions}>
                  <ButtonSmall iconSrc={UploadGray} />
                  <ButtonSmall iconSrc={TrashCanGray} />
                </div>
              </div>
              <div className={c.teamFields}>
                <div className={teamName.trim() ? c.inputValid : undefined}>
                  <Input
                    label='Ime ekipe'
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder='Ime ekipe'
                  />
                </div>
                <div className={c.fieldGroup}>
                  <span className={c.fieldLabel}>Skupina (nije obavezno)</span>
                  <FilterDropdown
                    variant='default'
                    value={group}
                    options={groupOptions}
                    onChange={setGroup}
                    placeholder='Odaberi skupinu'
                  />
                </div>
              </div>
            </div>

            <div className={c.playerSection}>
              <div className={c.playerSectionHeader}>
                <span className={c.playerSectionTitle}>Unos igrača</span>
                <span className={c.playerSectionSubtitle}>
                  Unos igrača nije obavezan u ovom koraku, može se kasnije
                  urediti
                </span>
              </div>

              <div className={c.playerList}>
                {(() => {
                  const cols = 3;
                  const totalSlots = players.length + 1;
                  const perCol = Math.max(3, Math.ceil(totalSlots / cols));
                  let placed = 0;
                  let newRowPlaced = false;

                  return Array.from({ length: cols }, (_, colIndex) => {
                    const start = placed;
                    const columnPlayers = players.slice(start, start + perCol);
                    placed += columnPlayers.length;
                    const showNewRow =
                      !newRowPlaced &&
                      columnPlayers.length < perCol &&
                      start + columnPlayers.length === players.length;
                    if (showNewRow) newRowPlaced = true;

                    if (columnPlayers.length === 0 && !showNewRow) return null;

                    return (
                      <div key={colIndex} className={c.playerColumn}>
                        {columnPlayers.map((player, i) => {
                          const globalIndex = start + i;
                          return (
                            <div
                              key={player.id ?? `new-${globalIndex}`}
                              className={c.playerRow}
                              onClick={() =>
                                setPlayerModal({
                                  type: 'edit',
                                  index: globalIndex,
                                })
                              }>
                              <span className={c.playerLabel}>
                                Igrač #{globalIndex + 1}
                              </span>
                              <Input
                                value={`${player.firstName} ${player.lastName}`}
                                readOnly
                              />
                            </div>
                          );
                        })}
                        {showNewRow && (
                          <div className={c.playerRow}>
                            <span className={c.playerLabel}>
                              Igrač #{players.length + 1}
                            </span>
                            <div className={c.newPlayerRow}>
                              <div className={c.newPlayerInput}>
                                <Input
                                  value=''
                                  readOnly
                                  placeholder='Ime i prezime'
                                  onClick={() =>
                                    setPlayerModal({ type: 'add' })
                                  }
                                />
                              </div>
                              <ButtonSmall
                                backgroundColor={BackgroundColor.White}
                                iconSrc={PlusBlack}
                                onClick={() => setPlayerModal({ type: 'add' })}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>

        <div className={`${common.footer} ${c.footer}`}>
          <Button icon={XWhite} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button
            icon={CheckBlack}
            variant='primary'
            onClick={handleSave}
            disabled={isSaving}>
            Spremi
          </Button>
        </div>
      </div>

      {playerModal && (
        <PlayerFormModal
          firstName={
            playerModal.type === 'edit'
              ? players[playerModal.index].firstName
              : undefined
          }
          lastName={
            playerModal.type === 'edit'
              ? players[playerModal.index].lastName
              : undefined
          }
          onSave={handlePlayerSave}
          onClose={() => setPlayerModal(null)}
        />
      )}
    </div>
  );
};

export default TeamFormModal;
