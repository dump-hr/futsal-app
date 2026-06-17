import { useRef, useState } from 'react';
import { EventType, type MatchDto } from '@futsal-app/types';
import {
  Button,
  ButtonSmall,
  FilterDropdown,
  PlayerAutocomplete,
} from '@components/index';
import { CheckBlack, XGray, XWhite } from '@assets/index';
import { useCloseComponent } from '@hooks/index';
import { type TeamSide, useNewEventForm } from './useNewEventForm';
import common from '../TeamFormModal/ModalCommon.module.scss';
import c from './NewEventModal.module.scss';

type NewEventModalProps = {
  match: MatchDto;
  mode: 'regulation' | 'shootout';
  currentMinute: number;
  presetEventType?: EventType;
  onClose: () => void;
};

export const NewEventModal: React.FC<NewEventModalProps> = ({
  match,
  mode,
  currentMinute,
  presetEventType,
  onClose,
}) => {
  const {
    teamSide,
    setTeamSide,
    eventType,
    setEventType,
    setSelectedPlayerId,
    isPending,
    homePlayers,
    playerPool,
    teamOptions,
    eventTypeOptions,
    title,
    subtitle,
    changeTeam,
    submit,
  } = useNewEventForm({
    match,
    mode,
    currentMinute,
    presetEventType,
    onClose,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const { overlayRef } = useCloseComponent({ onClose, containerRef: modalRef });

  const [autocompleteKey, setAutocompleteKey] = useState(0);

  const handleTeamChange = (side: TeamSide) => {
    if (changeTeam(side)) setAutocompleteKey((k) => k + 1);
  };

  return (
    <div className={`${common.overlay} ${c.overlay}`} ref={overlayRef}>
      <div className={c.modal} ref={modalRef} role='dialog' aria-modal='true'>
        <div className={common.header}>
          <div className={common.headerText}>
            <h2 className={common.title}>{title}</h2>
            <p className={common.subtitle}>{subtitle}</p>
          </div>
          <div className={c.closeButton}>
            <ButtonSmall iconSrc={XGray} hasBorder onClick={onClose} />
          </div>
        </div>

        <div className={c.fields}>
          <div className={c.field}>
            <label className={c.label}>Ekipa</label>
            <FilterDropdown<TeamSide | ''>
              value={teamSide ?? ''}
              options={teamOptions as { label: string; value: TeamSide | '' }[]}
              onChange={(val) => val && handleTeamChange(val as TeamSide)}
              variant='default'
              placeholder='Ime ekipe'
            />
          </div>

          <div className={c.field}>
            <label className={c.label}>Događaj</label>
            <FilterDropdown<EventType | ''>
              value={eventType ?? ''}
              options={
                eventTypeOptions as {
                  label: string;
                  value: EventType | '';
                }[]
              }
              onChange={(val) => val && setEventType(val as EventType)}
              variant='default'
              placeholder='Događaj'
            />
          </div>

          <div className={c.field}>
            <label className={c.label}>Igrač</label>
            <PlayerAutocomplete
              key={autocompleteKey}
              players={playerPool}
              placeholder='Ime prezime'
              selectOnFocus
              onQueryChange={() => setSelectedPlayerId(null)}
              onSelect={(player) => {
                setSelectedPlayerId(player ? player.id : null);
                if (player && !teamSide) {
                  const isHome = homePlayers.some((p) => p.id === player.id);
                  setTeamSide(isHome ? 'home' : 'away');
                }
              }}
            />
          </div>
        </div>

        <div className={common.footer}>
          <Button icon={XWhite} variant='secondary' onClick={onClose}>
            Odustani
          </Button>
          <Button
            icon={CheckBlack}
            variant='primary'
            onClick={submit}
            disabled={isPending}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};
