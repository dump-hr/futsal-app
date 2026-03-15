import clsx from 'clsx';
import { MatchEventDto, PlayerDto } from '@futsal-app/types';
import { MatchEventCard } from '@components/index';
import { MatchEventSaveData } from '@types';
import c from './MatchPanel.module.scss';

type MatchEventRowProps = {
  event: MatchEventDto;
  homePlayers: PlayerDto[];
  awayPlayers: PlayerDto[];
  isPenalty?: boolean;
  onUpdate: (eventId: number, data: MatchEventSaveData) => void;
  onDelete: (eventId: number) => void;
};

const MatchEventRow: React.FC<MatchEventRowProps> = ({
  event,
  homePlayers,
  awayPlayers,
  isPenalty = false,
  onUpdate,
  onDelete,
}) => {
  const side = event.isForHomeTeam ? 'left' : 'right';
  const players = event.isForHomeTeam ? homePlayers : awayPlayers;

  return (
    <div
      className={clsx(
        c.eventRow,
        event.isForHomeTeam ? c.eventLeft : c.eventRight,
      )}>
      <MatchEventCard
        minute={event.minute}
        playerName={
          event.player
            ? `${event.player.firstName} ${event.player.lastName}`
            : ''
        }
        eventType={event.eventType}
        side={side}
        players={players}
        isPenaltyShootout={isPenalty}
        onSave={(data) => onUpdate(event.id, data)}
        onDelete={() => onDelete(event.id)}
      />
    </div>
  );
};

export default MatchEventRow;
