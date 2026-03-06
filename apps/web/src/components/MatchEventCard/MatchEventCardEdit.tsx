import { useRef, useState } from 'react';
import clsx from 'clsx';
import { EventType, PlayerDto } from '@futsal-app/types';
import { ButtonSmall, EventDropdown, Input } from '@components/index';
import { TrashCanGray, CheckBlack } from '@assets/index';
import { BackgroundColor, MatchEventSaveData } from '../../types';
import { useCloseComponent, useSuggestions } from '@hooks/index';
import c from './MatchEventCard.module.scss';

type EditFormState = {
  minute: string;
  playerName: string;
  playerId?: number;
  eventType: `${EventType}` | null;
};

type MatchEventCardEditProps = {
  minute?: number;
  playerName?: string;
  eventType?: `${EventType}`;
  side: 'left' | 'right';
  players: PlayerDto[];
  isPenaltyShootout: boolean;
  isNew: boolean;
  onSave: (data: MatchEventSaveData) => void;
  onDelete: () => void;
  onCancel?: () => void;
  onStopEditing: () => void;
};

const MatchEventCardEdit: React.FC<MatchEventCardEditProps> = ({
  minute,
  playerName,
  eventType,
  side,
  players,
  isPenaltyShootout,
  isNew,
  onSave,
  onDelete,
  onCancel,
  onStopEditing,
}) => {
  const [editForm, setEditForm] = useState<EditFormState>({
    minute: minute != null ? String(minute) : '',
    playerName: playerName ?? '',
    playerId: undefined,
    eventType: eventType ?? null,
  });

  const {
    suggestions,
    showSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    inputProps,
    selectItem,
    closeSuggestions,
  } = useSuggestions({
    items: players,
    initialQuery: playerName ?? '',
    filterFn: (p, q) =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q),
    getLabel: (player) =>
      player ? `${player.firstName} ${player.lastName}` : 'Nepoznat netko',
    onSelect: (player) => {
      setEditForm((prev) => ({
        ...prev,
        playerName: player
          ? `${player.firstName} ${player.lastName}`
          : 'Nepoznat netko',
        playerId: player?.id,
      }));
    },
  });

  const nameWrapperRef = useRef<HTMLDivElement>(null);

  useCloseComponent({
    onClose: closeSuggestions,
    containerRef: nameWrapperRef,
  });

  const handleConfirm = () => {
    if (!editForm.eventType) return;
    onSave({
      minute: isPenaltyShootout ? 0 : parseInt(editForm.minute) || 0,
      playerName: editForm.playerName,
      playerId: editForm.playerId,
      eventType: editForm.eventType,
    });
    onStopEditing();
  };

  const handleCancel = () => {
    if (isNew && onCancel) {
      onCancel();
    } else {
      onStopEditing();
    }
  };

  const isLeft = side === 'left';

  return (
    <div className={clsx(c.card, c.editing, !isLeft && c.cardRight)}>
      <div className={clsx(c.topRow, !isLeft && c.topRowRight)}>
        <div className={c.actions}>
          <div onClick={isNew ? handleCancel : onDelete}>
            <ButtonSmall iconSrc={TrashCanGray} hasBorder />
          </div>
          <div onClick={handleConfirm}>
            <ButtonSmall
              iconSrc={CheckBlack}
              backgroundColor={BackgroundColor.White}
            />
          </div>
        </div>
        {!isPenaltyShootout && (
          <div className={c.minuteInput}>
            <input
              className={c.minuteInputField}
              value={editForm.minute}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
                setEditForm((prev) => ({ ...prev, minute: digits }));
              }}
            />
            <span>&apos;</span>
          </div>
        )}
      </div>
      <div className={clsx(c.fields, !isLeft && c.fieldsRight)}>
        <div ref={nameWrapperRef} className={c.nameInputWrapper}>
          <Input placeholder='Ime igrača' {...inputProps} />
          {showSuggestions && (
            <div className={clsx(c.suggestions, !isLeft && c.suggestionsRight)}>
              {[
                ...suggestions.map((player) => ({
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
                    highlightedIndex === index && c.suggestionItemHighlighted,
                    !isLeft && c.suggestionItemRight,
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => selectItem(option.item)}>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <EventDropdown
          side={side}
          isPenaltyShootout={isPenaltyShootout}
          value={editForm.eventType}
          onChange={(val) =>
            setEditForm((prev) => ({ ...prev, eventType: val }))
          }
        />
      </div>
    </div>
  );
};

export default MatchEventCardEdit;
