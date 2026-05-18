import { useRef, useState } from 'react';
import { EventType, MatchType } from '@futsal-app/types';
import { useMatchGet } from '@api/match';
import {
  useMatchEventsGet,
  useMatchEventCreate,
  useMatchEventDelete,
  useMatchEventUpdate,
} from '@api/matchEvent';
import { ButtonSmall } from '@components/ButtonSmall';
import { PlusBlack } from '@assets/icons';
import { useCloseComponent } from '@hooks/useCloseComponent';
import { BackgroundColor, MatchEventSaveData } from '@types';
import { MatchHeader } from './MatchHeader';
import { MatchEventRow } from './MatchEventRow';
import {
  TransientEventSlot,
  type PendingKind,
  type NewEventSide,
} from './TransientEventSlot';
import c from './MatchPanel.module.scss';

type MatchPanelProps = {
  matchId: number;
  onClose: () => void;
};

const SHOOTOUT_EVENTS: `${EventType}`[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

const isShootoutEvent = (eventType: `${EventType}`): boolean => {
  return SHOOTOUT_EVENTS.includes(eventType);
};

export const MatchPanel: React.FC<MatchPanelProps> = ({ matchId, onClose }) => {
  const { data: match, isLoading } = useMatchGet(matchId);
  const { data: events = [] } = useMatchEventsGet(matchId);
  const [pendingKind, setPendingKind] = useState<PendingKind | null>(null);
  const [newEventSide, setNewEventSide] = useState<NewEventSide | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  useCloseComponent({ onClose, containerRef: panelRef });

  const createEvent = useMatchEventCreate(matchId, {
    onSuccess: () => setNewEventSide(null),
  });
  const updateEvent = useMatchEventUpdate(matchId);
  const deleteEvent = useMatchEventDelete(matchId);

  if (isLoading) return <p>Loading...</p>;
  if (!match) return <p>No match found</p>;

  const isPlayoff = match.matchType !== MatchType.group;
  const isDraw = match.homeGoals === match.awayGoals;
  const regularEvents = events.filter((e) => !isShootoutEvent(e.eventType));
  const penaltyEvents = events.filter((e) => isShootoutEvent(e.eventType));
  const hasPenaltyEvents = penaltyEvents.length > 0;
  const showPenaltySection = (isPlayoff && isDraw) || hasPenaltyEvents;

  const penaltyHomeGoals = penaltyEvents.filter(
    (e) => e.isForHomeTeam && e.eventType === EventType.shootoutGoal,
  ).length;
  const penaltyAwayGoals = penaltyEvents.filter(
    (e) => !e.isForHomeTeam && e.eventType === EventType.shootoutGoal,
  ).length;

  const handleTeamPick = (isHome: boolean) => {
    setNewEventSide({ isHome, isPenalty: pendingKind === 'penalty' });
    setPendingKind(null);
  };

  const handleSave = (isForHomeTeam: boolean, data: MatchEventSaveData) => {
    const isPenalty = newEventSide?.isPenalty ?? false;
    createEvent.mutate({
      minute: isPenalty ? 0 : data.minute,
      matchId,
      playerId: data.playerId ?? null,
      eventType: data.eventType,
      isForHomeTeam,
    });
  };

  const handleUpdate = (eventId: number, data: MatchEventSaveData) => {
    updateEvent.mutate({
      id: eventId,
      dto: {
        minute: data.minute,
        playerId: data.playerId,
        eventType: data.eventType,
      },
    });
  };

  const handleDelete = (eventId: number) => {
    deleteEvent.mutate(eventId);
  };

  const homePlayers = match.homeTeam?.players ?? [];
  const awayPlayers = match.awayTeam?.players ?? [];

  const renderSlot = (kind: PendingKind) =>
    match.homeTeam &&
    match.awayTeam && (
      <TransientEventSlot
        kind={kind}
        pendingKind={pendingKind}
        newEventSide={newEventSide}
        homeTeam={match.homeTeam}
        awayTeam={match.awayTeam}
        homePlayers={homePlayers}
        awayPlayers={awayPlayers}
        onTeamPick={handleTeamPick}
        onPickerClose={() => setPendingKind(null)}
        onSave={handleSave}
        onCancel={() => setNewEventSide(null)}
      />
    );

  return (
    <div className={c.panel} ref={panelRef} role='dialog' aria-modal='true'>
      <MatchHeader
        homeTeamName={match.homeTeam?.name ?? ''}
        awayTeamName={match.awayTeam?.name ?? ''}
        homeGoals={match.homeGoals}
        awayGoals={match.awayGoals}
        matchType={match.matchType}
        timeOfMatch={match.timeOfMatch}
        penaltyHomeGoals={showPenaltySection ? penaltyHomeGoals : undefined}
        penaltyAwayGoals={showPenaltySection ? penaltyAwayGoals : undefined}
        onClose={onClose}
      />

      {showPenaltySection && (
        <div className={c.sectionLabel}>
          <span>IZVOĐENJE KAZNENIH UDARACA</span>
        </div>
      )}

      <div className={c.timeline}>
        {showPenaltySection && (
          <>
            <div className={c.addButton}>
              <div onClick={() => setPendingKind('penalty')}>
                <ButtonSmall
                  iconSrc={PlusBlack}
                  backgroundColor={BackgroundColor.White}
                />
              </div>
            </div>
            {renderSlot('penalty')}
            {[...penaltyEvents].reverse().map((event) => (
              <MatchEventRow
                key={event.id}
                event={event}
                homePlayers={homePlayers}
                awayPlayers={awayPlayers}
                isPenalty
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </>
        )}

        <div className={c.addButton}>
          <div onClick={() => setPendingKind('regular')}>
            <ButtonSmall
              iconSrc={PlusBlack}
              backgroundColor={BackgroundColor.White}
            />
          </div>
        </div>
        {renderSlot('regular')}
        {[...regularEvents].reverse().map((event) => (
          <MatchEventRow
            key={event.id}
            event={event}
            homePlayers={homePlayers}
            awayPlayers={awayPlayers}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};
