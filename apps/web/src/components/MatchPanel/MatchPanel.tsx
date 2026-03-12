import { useState } from 'react';
import clsx from 'clsx';
import { EventType, MatchEventDto } from '@futsal-app/types';
import {
  useMatch,
  useMatchEvents,
  useMatchEventCreate,
  useMatchEventDelete,
  useMatchEventUpdate,
} from '@api/index';
import { MatchEventCard, ButtonSmall } from '@components/index';
import { PlusBlack } from '@assets/index';
import { BackgroundColor, MatchEventSaveData } from '@types';
import MatchHeader from './MatchHeader';
import TeamPicker from './TeamPicker';
import c from './MatchPanel.module.scss';

type MatchPanelProps = {
  matchId: number;
  onClose: () => void;
};

type NewEventSide = {
  isHome: boolean;
  isPenalty: boolean;
};

const SHOOTOUT_EVENTS: `${EventType}`[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

const isShootoutEvent = (eventType: `${EventType}`): boolean => {
  return SHOOTOUT_EVENTS.includes(eventType);
};

const MatchPanel: React.FC<MatchPanelProps> = ({ matchId, onClose }) => {
  const { data: match, isLoading } = useMatch(matchId);
  const { data: events = [] } = useMatchEvents(matchId);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [newEventSide, setNewEventSide] = useState<NewEventSide | null>(null);

  const createEvent = useMatchEventCreate(matchId, {
    onSuccess: () => setNewEventSide(null),
  });
  const updateEvent = useMatchEventUpdate(matchId);
  const deleteEvent = useMatchEventDelete(matchId);

  if (isLoading) return <p>Loading...</p>;
  if (!match) return <p>No match found</p>;

  const isPlayoff = match.matchType !== 'group';
  const isDraw = match.homeGoals === match.awayGoals;
  const regularEvents = events.filter(
    (e) => !isShootoutEvent(e.eventType),
  );
  const penaltyEvents = events.filter((e) =>
    isShootoutEvent(e.eventType),
  );
  // TODO: also check that the 30-minute timer has expired once timer is implemented
  const showPenaltySection = isPlayoff && isDraw;

  const penaltyHomeGoals = penaltyEvents.filter(
    (e) => e.isForHomeTeam && e.eventType === EventType.shootoutGoal,
  ).length;
  const penaltyAwayGoals = penaltyEvents.filter(
    (e) => !e.isForHomeTeam && e.eventType === EventType.shootoutGoal,
  ).length;

  const handleTeamPick = (isHome: boolean) => {
    setNewEventSide({ isHome, isPenalty: showPenaltySection });
    setShowTeamPicker(false);
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

  const renderEvent = (event: MatchEventDto, isPenalty = false) => {
    const side = event.isForHomeTeam ? 'left' : 'right';
    const players = event.isForHomeTeam ? homePlayers : awayPlayers;

    // Time will be auto filled when we add a live timer
    return (
      <div
        key={event.id}
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
          onSave={(data) => handleUpdate(event.id, data)}
          onDelete={() => handleDelete(event.id)}
        />
      </div>
    );
  };

  return (
    <div className={c.panel}>
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

      <div className={c.addButton}>
        <div onClick={() => setShowTeamPicker(true)}>
          <ButtonSmall
            iconSrc={PlusBlack}
            backgroundColor={BackgroundColor.White}
          />
        </div>
      </div>

      <div className={c.timeline}>
        {showTeamPicker && match.homeTeam && match.awayTeam && (
          <div className={c.eventRow}>
            <TeamPicker
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              onPick={handleTeamPick}
              onClose={() => setShowTeamPicker(false)}
            />
          </div>
        )}

        {newEventSide && (
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
              onSave={(data) => handleSave(newEventSide.isHome, data)}
              onDelete={() => setNewEventSide(null)}
              onCancel={() => setNewEventSide(null)}
            />
          </div>
        )}

        {showPenaltySection &&
          [...penaltyEvents]
            .reverse()
            .map((event) => renderEvent(event, true))}
        {[...regularEvents]
          .reverse()
          .map((event) => renderEvent(event))}
      </div>
    </div>
  );
};

export default MatchPanel;
