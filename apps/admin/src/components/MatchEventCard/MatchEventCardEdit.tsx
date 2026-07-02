import { useState } from 'react';
import clsx from 'clsx';
import { EventType, PlayerDto } from '@futsal-app/types';
import {
  ButtonSmall,
  EventDropdown,
  PlayerAutocomplete,
} from '@components/index';
import { TrashCanGray, CheckBlack } from '@assets/index';
import { BackgroundColor, MatchEventSaveData } from '@types';
import c from './MatchEventCard.module.scss';

type EditFormState = {
  minute: string;
  playerName: string;
  playerId: number | null;
  eventType: `${EventType}` | null;
};

type MatchEventCardEditProps = {
  minute?: number;
  playerName?: string;
  playerId?: number | null;
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

export const MatchEventCardEdit: React.FC<MatchEventCardEditProps> = ({
  minute,
  playerName,
  playerId,
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
    playerId: playerId ?? null,
    eventType: eventType ?? null,
  });

  const handleConfirm = () => {
    if (!editForm.eventType) return;
    onSave({
      minute: isPenaltyShootout ? 0 : parseInt(editForm.minute) || 0,
      playerName: editForm.playerName,
      playerId: editForm.playerId,
      eventType: editForm.eventType,
    });
    if (!isNew) {
      onStopEditing();
    }
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
        <PlayerAutocomplete
          players={players}
          initialQuery={playerName ?? ''}
          placeholder='Ime igrača'
          align={isLeft ? 'left' : 'right'}
          onSelect={(player) =>
            setEditForm((prev) => ({
              ...prev,
              playerName: player
                ? `${player.firstName} ${player.lastName}`
                : 'Nepoznat netko',
              playerId: player?.id ?? null,
            }))
          }
        />
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
