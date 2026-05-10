import clsx from 'clsx';
import { PlayerDto } from '@futsal-app/types';
import { MatchEventCard } from '@components/index';
import { MatchEventSaveData } from '@types';
import TeamPicker from './TeamPicker';
import c from './MatchPanel.module.scss';

export type PendingKind = 'regular' | 'penalty';

export type NewEventSide = {
  isHome: boolean;
  isPenalty: boolean;
};

type Team = {
  name: string;
  logoUrl?: string | null;
};

type TransientEventSlotProps = {
  kind: PendingKind;
  pendingKind: PendingKind | null;
  newEventSide: NewEventSide | null;
  homeTeam: Team;
  awayTeam: Team;
  homePlayers: PlayerDto[];
  awayPlayers: PlayerDto[];
  onTeamPick: (isHome: boolean) => void;
  onPickerClose: () => void;
  onSave: (isForHomeTeam: boolean, data: MatchEventSaveData) => void;
  onCancel: () => void;
};

const TransientEventSlot: React.FC<TransientEventSlotProps> = ({
  kind,
  pendingKind,
  newEventSide,
  homeTeam,
  awayTeam,
  homePlayers,
  awayPlayers,
  onTeamPick,
  onPickerClose,
  onSave,
  onCancel,
}) => {
  const isPenaltyKind = kind === 'penalty';
  const showPicker = pendingKind === kind;
  const showCard = newEventSide && newEventSide.isPenalty === isPenaltyKind;

  return (
    <>
      {showPicker && (
        <div className={c.eventRow}>
          <TeamPicker
            homeTeam={homeTeam}
            awayTeam={awayTeam}
            onPick={onTeamPick}
            onClose={onPickerClose}
          />
        </div>
      )}
      {showCard && (
        <div
          className={clsx(
            c.eventRow,
            newEventSide.isHome ? c.eventLeft : c.eventRight,
          )}>
          <MatchEventCard
            side={newEventSide.isHome ? 'left' : 'right'}
            players={newEventSide.isHome ? homePlayers : awayPlayers}
            isPenaltyShootout={newEventSide.isPenalty}
            isNew
            onSave={(data) => onSave(newEventSide.isHome, data)}
            onDelete={onCancel}
            onCancel={onCancel}
          />
        </div>
      )}
    </>
  );
};

export default TransientEventSlot;
