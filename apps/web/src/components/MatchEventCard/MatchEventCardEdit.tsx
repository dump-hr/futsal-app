import { useRef, useState } from 'react';
import clsx from 'clsx';
import { EventType } from '@futsal-app/types';
import { ButtonSmall, EventDropdown } from '@components/index';
import { TrashCanGray, CheckBlack } from '@assets/index';
import { BackgroundColor, MatchEventSaveData } from '../../types';
import { usePlayerSearch } from '@api/index';
import useCloseComponent from '@hooks/useCloseComponent';
import c from './MatchEventCard.module.scss';

type EditFormState = {
  minute: string;
  playerName: string;
  playerId?: number;
  eventType: EventType | null;
};

type MatchEventCardEditProps = {
  minute?: number;
  playerName?: string;
  eventType?: EventType;
  side: 'left' | 'right';
  teamId: number;
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
  teamId,
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

  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: suggestions = [] } = usePlayerSearch(
    teamId,
    editForm.playerName,
  );

  const nameWrapperRef = useRef<HTMLDivElement>(null);

  useCloseComponent({
    onClose: () => setShowSuggestions(false),
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

  const handleSelectSuggestion = (
    id: number,
    firstName: string,
    lastName: string,
  ) => {
    setEditForm((prev) => ({
      ...prev,
      playerName: `${firstName} ${lastName}`,
      playerId: id,
    }));
    setShowSuggestions(false);
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
          <input
            className={clsx(c.nameInput, !isLeft && c.nameInputRight)}
            value={editForm.playerName}
            placeholder='Ime igrača'
            onChange={(e) => {
              setEditForm((prev) => ({
                ...prev,
                playerName: e.target.value,
                playerId: undefined,
              }));
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              className={clsx(c.suggestions, !isLeft && c.suggestionsRight)}>
              {suggestions.map((player) => (
                <button
                  key={player.id}
                  type='button'
                  className={clsx(
                    c.suggestionItem,
                    !isLeft && c.suggestionItemRight,
                  )}
                  onClick={() =>
                    handleSelectSuggestion(
                      player.id,
                      player.firstName,
                      player.lastName,
                    )
                  }>
                  {player.firstName} {player.lastName}
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
