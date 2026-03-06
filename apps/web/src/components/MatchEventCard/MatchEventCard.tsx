import { useState } from 'react';
import { EventType, PlayerDto } from '@futsal-app/types';
import { MatchEventSaveData } from '../../types';
import MatchEventCardEdit from './MatchEventCardEdit';
import MatchEventCardDisplay from './MatchEventCardDisplay';

type MatchEventCardProps = {
  minute?: number;
  playerName?: string;
  eventType?: `${EventType}`;
  side: 'left' | 'right';
  players: PlayerDto[];
  isPenaltyShootout?: boolean;
  isNew?: boolean;
  onSave: (data: MatchEventSaveData) => void;
  onDelete: () => void;
  onCancel?: () => void;
};

const MatchEventCard: React.FC<MatchEventCardProps> = ({
  minute,
  playerName,
  eventType,
  side,
  players,
  isPenaltyShootout = false,
  isNew = false,
  onSave,
  onDelete,
  onCancel,
}) => {
  const [isEditing, setIsEditing] = useState(isNew);

  if (isEditing) {
    return (
      <MatchEventCardEdit
        minute={minute}
        playerName={playerName}
        eventType={eventType}
        side={side}
        players={players}
        isPenaltyShootout={isPenaltyShootout}
        isNew={isNew}
        onSave={onSave}
        onDelete={onDelete}
        onCancel={onCancel}
        onStopEditing={() => setIsEditing(false)}
      />
    );
  }

  return (
    <MatchEventCardDisplay
      minute={minute}
      playerName={playerName}
      eventType={eventType}
      side={side}
      isPenaltyShootout={isPenaltyShootout}
      onEdit={() => setIsEditing(true)}
      onDelete={onDelete}
    />
  );
};

export default MatchEventCard;
