import { useRef } from 'react';
import clsx from 'clsx';
import { EventType, type MatchDto, type PlayerDto } from '@futsal-app/types';
import {
  Button,
  ButtonSmall,
  FilterDropdown,
  Input,
} from '@components/index';
import { CheckBlack, XGray, XWhite } from '@assets/icons';
import { useCloseComponent, useSuggestions } from '@hooks/index';
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

const NewEventModal: React.FC<NewEventModalProps> = ({
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
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const { overlayRef } = useCloseComponent({ onClose, containerRef: modalRef });

  const playerSuggestions = useSuggestions<PlayerDto>({
    items: playerPool,
    filterFn: (p, q) =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q),
    getLabel: (p) =>
      p ? `${p.firstName} ${p.lastName}` : 'Nepoznat netko',
    onSelect: (player) => {
      setSelectedPlayerId(player ? player.id : null);
      if (player && !teamSide) {
        const isHome = homePlayers.some((p) => p.id === player.id);
        setTeamSide(isHome ? 'home' : 'away');
      }
    },
  });

  useCloseComponent({
    onClose: playerSuggestions.closeSuggestions,
    containerRef: playerWrapperRef,
  });

  const handleTeamChange = (side: TeamSide) => {
    if (changeTeam(side)) playerSuggestions.setQuery('');
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

          <div className={clsx(c.field, c.playerField)} ref={playerWrapperRef}>
            <label className={c.label}>Igrač</label>
            <Input
              placeholder='Ime prezime'
              {...playerSuggestions.inputProps}
              onChange={(e) => {
                setSelectedPlayerId(null);
                playerSuggestions.inputProps.onChange(e);
              }}
              onFocus={(e) => {
                playerSuggestions.inputProps.onFocus();
                e.currentTarget.select();
              }}
              style={{ maxWidth: '100%' }}
            />
            {playerSuggestions.showSuggestions && (
              <div className={c.suggestions}>
                {[
                  ...playerSuggestions.suggestions.map((player) => ({
                    key: player.id,
                    item: player as PlayerDto | null,
                    label: `${player.firstName} ${player.lastName}`,
                  })),
                  {
                    key: 'unknown',
                    item: null as PlayerDto | null,
                    label: 'Nepoznat netko',
                  },
                ].map((option, index) => (
                  <button
                    key={option.key}
                    type='button'
                    className={clsx(
                      c.suggestionItem,
                      playerSuggestions.highlightedIndex === index &&
                        c.suggestionItemHighlighted,
                    )}
                    onMouseEnter={() =>
                      playerSuggestions.setHighlightedIndex(index)
                    }
                    onClick={() => playerSuggestions.selectItem(option.item)}>
                    {option.label}
                  </button>
                ))}
              </div>
            )}
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

export default NewEventModal;
