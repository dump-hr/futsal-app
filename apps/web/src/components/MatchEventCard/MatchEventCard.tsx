import { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { EventType } from '@futsal-app/types';
import { ButtonSmall, EventDropdown } from '@components/index';
import { TrashCanGray, CheckBlack, PencilGray } from '@assets/index';
import { BackgroundColor, EVENT_LABELS } from '../../types';
import { usePlayerSearch } from '@api/index';
import c from './MatchEventCard.module.scss';

type MatchEventCardProps = {
  minute?: number;
  playerName?: string;
  eventType?: EventType;
  side: 'left' | 'right';
  teamId: number;
  isPenaltyShootout?: boolean;
  isNew?: boolean;
  onSave: (data: {
    minute: number;
    playerName: string;
    eventType: EventType;
  }) => void;
  onDelete: () => void;
};

const MatchEventCard: React.FC<MatchEventCardProps> = ({
  minute,
  playerName,
  eventType,
  side,
  teamId,
  isPenaltyShootout = false,
  isNew = false,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [editMinute, setEditMinute] = useState(
    minute != null ? String(minute) : '',
  );
  const [editPlayerName, setEditPlayerName] = useState(playerName ?? '');
  const [editEventType, setEditEventType] = useState<EventType | null>(
    eventType ?? null,
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { data: suggestions } = usePlayerSearch(teamId, editPlayerName);

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) return [];
    return suggestions;
  }, [suggestions]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStartEdit = () => {
    setEditMinute(minute != null ? String(minute) : '');
    setEditPlayerName(playerName ?? '');
    setEditEventType(eventType ?? null);
    setIsEditing(true);
  };

  const handleConfirm = () => {
    if (!editEventType) return;
    onSave({
      minute: parseInt(editMinute) || 0,
      playerName: editPlayerName,
      eventType: editEventType,
    });
    setIsEditing(false);
  };

  const handleSelectSuggestion = (firstName: string, lastName: string) => {
    setEditPlayerName(`${firstName} ${lastName}`);
    setShowSuggestions(false);
  };

  const isLeft = side === 'left';

  if (isEditing) {
    return (
      <div className={clsx(c.card, c.editing, !isLeft && c.cardRight)}>
        <div className={clsx(c.topRow, !isLeft && c.topRowRight)}>
          <div className={c.actions}>
            <div onClick={onDelete}>
              <ButtonSmall iconSrc={TrashCanGray} hasBorder />
            </div>
            <div onClick={handleConfirm}>
              <ButtonSmall
                iconSrc={CheckBlack}
                backgroundColor={BackgroundColor.White}
              />
            </div>
          </div>
          <input
            className={c.minuteInput}
            value={`${editMinute}'`}
            onChange={(e) => setEditMinute(e.target.value.replace(/'/g, ''))}
          />
        </div>
        <div className={clsx(c.fields, !isLeft && c.fieldsRight)}>
          <div className={c.nameInputWrapper}>
            <input
              ref={inputRef}
              className={clsx(c.nameInput, !isLeft && c.nameInputRight)}
              value={editPlayerName}
              onChange={(e) => {
                setEditPlayerName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className={clsx(c.suggestions, !isLeft && c.suggestionsRight)}>
                {filteredSuggestions.map((player) => (
                  <button
                    key={player.id}
                    type='button'
                    className={clsx(
                      c.suggestionItem,
                      !isLeft && c.suggestionItemRight,
                    )}
                    onClick={() =>
                      handleSelectSuggestion(player.firstName, player.lastName)
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
            value={editEventType}
            onChange={setEditEventType}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={clsx(c.card, !isLeft && c.cardRight)}>
      <div className={clsx(c.topRow, !isLeft && c.topRowRight)}>
        <div className={c.actions}>
          <div onClick={onDelete}>
            <ButtonSmall iconSrc={TrashCanGray} hasBorder />
          </div>
          <div onClick={handleStartEdit}>
            <ButtonSmall iconSrc={PencilGray} hasBorder />
          </div>
        </div>
        <p className={c.minute}>{minute}&apos;</p>
      </div>
      <div className={clsx(c.info, !isLeft && c.infoRight)}>
        <p className={c.playerName}>{playerName}</p>
        <p className={c.eventLabel}>
          {eventType ? EVENT_LABELS[eventType].toUpperCase() : ''}
        </p>
      </div>
    </div>
  );
};

export default MatchEventCard;
