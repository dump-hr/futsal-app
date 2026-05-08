import { useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import {
  EventType,
  type MatchDto,
  type PlayerDto,
} from '@futsal-app/types';
import {
  Button,
  ButtonSmall,
  FilterDropdown,
} from '@components/index';
import { CheckBlack, XGray, XWhite } from '@assets/icons';
import { useMatchEventCreate } from '@api/index';
import { useCloseComponent, useSuggestions } from '@hooks/index';
import { EVENT_LABELS } from '@types';
import common from '../TeamFormModal/ModalCommon.module.scss';
import c from './NewEventModal.module.scss';

type TeamSide = 'home' | 'away';

const REGULATION_EVENT_TYPES: EventType[] = [
  EventType.goal,
  EventType.ownGoal,
  EventType.penaltyGoal,
  EventType.yellowCard,
  EventType.redCard,
];

const SHOOTOUT_EVENT_TYPES: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

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
  const isShootout = mode === 'shootout';
  const homePlayers = useMemo(
    () => match.homeTeam?.players ?? [],
    [match.homeTeam?.players],
  );
  const awayPlayers = useMemo(
    () => match.awayTeam?.players ?? [],
    [match.awayTeam?.players],
  );

  const [teamSide, setTeamSide] = useState<TeamSide | null>(null);
  const [eventType, setEventType] = useState<EventType | null>(
    presetEventType ?? null,
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [playerInputFocused, setPlayerInputFocused] = useState(false);

  const { mutate: createEvent, isPending } = useMatchEventCreate(match.id, {
    onSuccess: onClose,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const { overlayRef } = useCloseComponent({ onClose, containerRef: modalRef });

  const teamOptions: { label: string; value: TeamSide }[] = [
    { label: match.homeTeam?.name ?? 'Domaća ekipa', value: 'home' },
    { label: match.awayTeam?.name ?? 'Gostujuća ekipa', value: 'away' },
  ];

  const eventTypeOptions = useMemo(() => {
    const types = isShootout ? SHOOTOUT_EVENT_TYPES : REGULATION_EVENT_TYPES;
    return types.map((value) => ({ label: EVENT_LABELS[value], value }));
  }, [isShootout]);

  const playerPool: PlayerDto[] = useMemo(() => {
    if (teamSide === 'home') return homePlayers;
    if (teamSide === 'away') return awayPlayers;
    return [...homePlayers, ...awayPlayers];
  }, [teamSide, homePlayers, awayPlayers]);

  const playerSuggestions = useSuggestions<PlayerDto>({
    items: playerPool,
    filterFn: (p, q) =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q),
    getLabel: (p) => (p ? `${p.firstName} ${p.lastName}` : ''),
    onSelect: (player) => {
      if (!player) return;
      if (!teamSide) {
        const isHome = homePlayers.some((p) => p.id === player.id);
        setTeamSide(isHome ? 'home' : 'away');
      }
      setSelectedPlayerId(player.id);
    },
  });

  useCloseComponent({
    onClose: playerSuggestions.closeSuggestions,
    containerRef: playerWrapperRef,
  });

  const handleTeamChange = (side: TeamSide) => {
    setTeamSide(side);
    if (selectedPlayerId != null) {
      const sourcePool = side === 'home' ? homePlayers : awayPlayers;
      if (!sourcePool.some((p) => p.id === selectedPlayerId)) {
        setSelectedPlayerId(null);
        playerSuggestions.setQuery('');
      }
    }
  };

  const handleSubmit = () => {
    if (!eventType) {
      toast.error('Odaberi događaj');
      return;
    }
    if (!teamSide) {
      toast.error('Odaberi ekipu');
      return;
    }

    createEvent({
      minute: isShootout ? 0 : currentMinute,
      matchId: match.id,
      playerId: selectedPlayerId,
      eventType,
      isForHomeTeam: teamSide === 'home',
    });
  };

  const title = isShootout ? 'Novi penal' : 'Novi događaj';
  const subtitle = isShootout
    ? 'Unesi izvođača kaznenog udarca'
    : 'Odaberi ekipu, događaj i igrača';

  const playerInputDisabled = playerPool.length === 0;
  const playerWrapperClass = clsx(
    c.playerInputShell,
    playerInputFocused && c.focused,
    playerInputDisabled && c.disabled,
  );

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
            <div className={playerWrapperClass}>
              <input
                className={c.playerInput}
                placeholder='Ime prezime'
                disabled={playerInputDisabled}
                {...playerSuggestions.inputProps}
                onChange={(e) => {
                  // Typing invalidates a previously-picked suggestion so we
                  // never submit a stale playerId that doesn't match the
                  // visible name. The user must re-pick from the list to
                  // attach a player to the event.
                  setSelectedPlayerId(null);
                  playerSuggestions.inputProps.onChange(e);
                }}
                onFocus={(e) => {
                  setPlayerInputFocused(true);
                  playerSuggestions.inputProps.onFocus();
                  e.currentTarget.select();
                }}
                onBlur={() => setPlayerInputFocused(false)}
              />
            </div>
            {playerSuggestions.showSuggestions && !playerInputDisabled && (
              <div className={c.suggestions}>
                {playerSuggestions.suggestions.length === 0 ? (
                  <div className={c.suggestionEmpty}>Nema rezultata</div>
                ) : (
                  playerSuggestions.suggestions.map((player, index) => (
                    <button
                      key={player.id}
                      type='button'
                      className={clsx(
                        c.suggestionItem,
                        playerSuggestions.highlightedIndex === index &&
                          c.highlighted,
                      )}
                      onMouseEnter={() =>
                        playerSuggestions.setHighlightedIndex(index)
                      }
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => playerSuggestions.selectItem(player)}>
                      {player.firstName} {player.lastName}
                    </button>
                  ))
                )}
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
            onClick={handleSubmit}
            disabled={isPending}>
            Spremi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewEventModal;
