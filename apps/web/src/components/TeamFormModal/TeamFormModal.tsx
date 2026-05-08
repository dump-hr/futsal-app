import { useCallback } from 'react';
import {
  Button,
  FilterDropdown,
  ButtonSmall,
  Input,
  LogoUpload,
} from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack, XGray } from '@assets/icons';
import PlayerFormModal from './PlayerFormModal';
import PlayerGrid from './PlayerGrid';
import { useTeamForm } from './useTeamForm';
import common from './ModalCommon.module.scss';
import c from './TeamFormModal.module.scss';

type TeamFormModalProps = {
  teamId?: number;
  onClose: () => void;
};

const TeamFormModal: React.FC<TeamFormModalProps> = ({ teamId, onClose }) => {
  const {
    teamName,
    setTeamName,
    group,
    setGroup,
    players,
    playerModal,
    setPlayerModal,
    pendingLogo,
    removeLogo,
    existingTeam,
    groupOptions,
    isEdit,
    ready,
    initialized,
    isSaving,
    teamNameError,
    handleLogoChange,
    handlePlayerSave,
    handleSave,
  } = useTeamForm({ teamId, onClose });

  const handleClose = useCallback(() => onClose(), [onClose]);
  useCloseComponent({ onClose: handleClose });

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
              <LogoUpload
                file={pendingLogo}
                logoUrl={existingTeam?.logoUrl}
                removed={removeLogo}
                onFileChange={handleLogoChange}
              />
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
