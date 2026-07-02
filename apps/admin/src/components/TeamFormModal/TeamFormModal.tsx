import { useCallback } from 'react';
import {
  Button,
  ButtonSmall,
  FilterDropdown,
  Input,
  LogoUpload,
  ModalConfirmation,
} from '@components/index';
import { useCloseComponent } from '@hooks/index';
import { XWhite, CheckBlack, XGray, TrashCanBlack } from '@assets/index';
import { PlayerGrid } from './PlayerGrid';
import { useTeamForm } from './useTeamForm';
import common from './ModalCommon.module.scss';
import c from './TeamFormModal.module.scss';

type TeamFormModalProps = {
  teamId?: number;
  initialGroupId?: number;
  onClose: () => void;
};

export const TeamFormModal: React.FC<TeamFormModalProps> = ({
  teamId,
  initialGroupId,
  onClose,
}) => {
  const {
    teamName,
    setTeamName,
    group,
    setGroup,
    players,
    pendingDeleteIndex,
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
    updatePlayer,
    addPlayer,
    requestDeletePlayer,
    cancelDeletePlayer,
    confirmDeletePlayer,
    handleSave,
  } = useTeamForm({ teamId, initialGroupId, onClose });

  const handleClose = useCallback(() => onClose(), [onClose]);
  useCloseComponent({ onClose: handleClose });

  if (!ready || (isEdit && !initialized)) return null;

  const playerToDelete =
    pendingDeleteIndex !== null ? players[pendingDeleteIndex] : null;

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
                onUpdatePlayer={updatePlayer}
                onRequestDeletePlayer={requestDeletePlayer}
                onAddPlayer={addPlayer}
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

      {playerToDelete && (
        <ModalConfirmation
          description='Ovim postupkom izbrisat ćete igrača'
          boldText={
            `${playerToDelete.firstName} ${playerToDelete.lastName}`.trim() ||
            'Igrač'
          }
          icon={TrashCanBlack}
          circleVariant='gray'
          onCancel={cancelDeletePlayer}
          onConfirm={confirmDeletePlayer}
        />
      )}
    </div>
  );
};
