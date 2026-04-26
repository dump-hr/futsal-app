import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import {
  Button,
  FilterDropdown,
  ButtonSmall,
  Input,
  LogoUpload,
} from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack, XGray } from '@assets/icons';
import {
  useTeamGet,
  useTeamCreate,
  useTeamUpdate,
  useTeamPlayersSync,
  useTeamUploadLogo,
} from '@api/team';
import { useGroupsGet } from '@api/group';
import { PlayerModalAdd, PlayerModalEditByIndex } from '@types';
import { GroupOption } from '@constants/groupOptions';
import PlayerFormModal from './PlayerFormModal';
import PlayerGrid, { type PlayerEntry } from './PlayerGrid';
import common from './ModalCommon.module.scss';
import c from './TeamFormModal.module.scss';

//TODO: Get tournament ID from URL params or context
const TOURNAMENT_ID = 1;

type PlayerModal = PlayerModalAdd | PlayerModalEditByIndex;

type TeamFormModalProps = {
  teamId?: number;
  onClose: () => void;
};

const TeamFormModal: React.FC<TeamFormModalProps> = ({ teamId, onClose }) => {
  const [teamName, setTeamName] = useState('');
  const [group, setGroup] = useState<GroupOption>('none');
  const [players, setPlayers] = useState<PlayerEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [playerModal, setPlayerModal] = useState<PlayerModal | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [pendingLogo, setPendingLogo] = useState<File | null>(null);

  const teamNameError = submitAttempted && !teamName.trim();

  const { data: existingTeam } = useTeamGet(teamId);
  const { mutateAsync: createTeam } = useTeamCreate();
  const { mutateAsync: updateTeam } = useTeamUpdate();
  const { mutateAsync: syncPlayers } = useTeamPlayersSync();
  const { mutateAsync: uploadLogo } = useTeamUploadLogo();
  const { data: groups } = useGroupsGet();

  const handleClose = useCallback(() => onClose(), [onClose]);
  useCloseComponent({ onClose: handleClose });

  const isEdit = teamId !== undefined;
  const ready = !isEdit || !!existingTeam;

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
      setInitialized(true);
    }
  }, [existingTeam, isEdit, initialized]);

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
      setSubmitAttempted(true);
      toast.error('Unesite ime ekipe');
      return;
    }

    setIsSaving(true);
    try {
      const targetTeamId = isEdit
        ? (
            await updateTeam({
              id: teamId,
              dto: {
                name: teamName,
                groupId: group === 'none' ? null : Number(group),
              },
            })
          ).id
        : (
            await createTeam({
              name: teamName,
              groupId: group === 'none' ? undefined : Number(group),
              tournamentId: TOURNAMENT_ID,
            })
          ).id;

      await syncPlayers({
        teamId: targetTeamId,
        dto: {
          players: players.map(({ id, firstName, lastName }) => ({
            id,
            firstName,
            lastName,
          })),
        },
      });

      if (!isEdit && pendingLogo) {
        try {
          await uploadLogo({ teamId: targetTeamId, file: pendingLogo });
        } catch {
          console.error('Failed to upload logo for new team');
        }
      }
      onClose();
    } catch (error) {
      console.error('Failed to save team:', error);
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
              {isEdit ? (
                <LogoUpload teamId={teamId} logoUrl={existingTeam?.logoUrl} />
              ) : (
                <LogoUpload file={pendingLogo} onFileChange={setPendingLogo} />
              )}
              <div className={c.teamFields}>
                <div className={teamName.trim() ? c.inputValid : undefined}>
                  <Input
                    label='Ime ekipe'
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder='Ime ekipe'
                    error={teamNameError}
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

              <PlayerGrid
                players={players}
                onEditPlayer={(index) =>
                  setPlayerModal({ type: 'edit', index })
                }
                onAddPlayer={() => setPlayerModal({ type: 'add' })}
              />
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
