import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { EventType } from '@futsal-app/types';
import { useMatchGet, useMatchDeactivate } from '@api/match';
import { useMatchEventsGet } from '@api/matchEvent';
import { ModalConfirmation } from '@components/ModalConfirmation';
import { NewEventModal } from '@components/NewEventModal';
import { useMatchTimer } from '@hooks/useMatchTimer';
import { CheckBlack, HistoryBlack } from '@assets/icons';
import { routes } from '@routes/routes';
import { MatchTimerHeader } from './MatchTimerHeader';
import { TimerView } from './TimerView';
import { ShootoutView } from './ShootoutView';
import { EventsColumns } from './EventsColumns';
import { REGULATION_HOTKEYS, SHOOTOUT_HOTKEYS } from './constants';
import c from './MatchTimerPage.module.scss';

type ModalState = {
  presetEventType?: EventType;
} | null;

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

export const MatchTimerPage = () => {
  const [isShootoutView, setIsShootoutView] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [penaltyConfirmOpen, setPenaltyConfirmOpen] = useState(false);

  const params = useParams<{ matchId: string }>();
  const matchId = Number(params.matchId);
  const [, navigate] = useLocation();

  const { data: match, isLoading } = useMatchGet(matchId);
  const { data: events = [] } = useMatchEventsGet(matchId);
  const { mutate: deactivate } = useMatchDeactivate();

  const { elapsedSeconds, isRunning, toggle, setElapsed, clearTimer } =
    useMatchTimer(matchId);

  const currentMinute = Math.floor(elapsedSeconds / 60);

  const shootoutCounts = { home: 0, away: 0 };
  for (const event of events) {
    if (event.eventType !== EventType.shootoutGoal) continue;
    if (event.isForHomeTeam) shootoutCounts.home += 1;
    else shootoutCounts.away += 1;
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (modalState || endConfirmOpen || penaltyConfirmOpen) return;
      if (isTypingTarget(e.target)) return;

      if (e.key === ' ' && !isShootoutView) {
        e.preventDefault();
        toggle();
        return;
      }

      const key = e.key.toLowerCase();
      const map = isShootoutView ? SHOOTOUT_HOTKEYS : REGULATION_HOTKEYS;
      const eventType = map[key];
      if (eventType) {
        e.preventDefault();
        setModalState({ presetEventType: eventType });
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isShootoutView, modalState, endConfirmOpen, penaltyConfirmOpen, toggle]);

  if (isLoading) {
    return (
      <div className={c.page}>
        <p className={c.loading}>Učitavanje...</p>
      </div>
    );
  }

  if (!match) {
    return (
      <div className={c.page}>
        <p className={c.loading}>Utakmica nije pronađena</p>
      </div>
    );
  }

  const handleEndMatch = () => {
    deactivate(undefined, {
      onSuccess: () => {
        clearTimer();
        navigate(routes.MATCHES);
      },
    });
  };

  return (
    <div className={c.page}>
      <MatchTimerHeader homeTeam={match.homeTeam} awayTeam={match.awayTeam} />

      {isShootoutView ? (
        <ShootoutView
          homeShootoutGoals={shootoutCounts.home}
          awayShootoutGoals={shootoutCounts.away}
          onOpenNewEvent={() => setModalState({})}
          onEndMatch={() => setEndConfirmOpen(true)}
        />
      ) : (
        <TimerView
          homeGoals={match.homeGoals}
          awayGoals={match.awayGoals}
          elapsedSeconds={elapsedSeconds}
          isRunning={isRunning}
          onElapsedChange={setElapsed}
          onOpenNewEvent={() => setModalState({})}
          onTogglePenalty={() => setPenaltyConfirmOpen(true)}
          onEndMatch={() => setEndConfirmOpen(true)}
        />
      )}

      <EventsColumns
        events={events}
        mode={isShootoutView ? 'shootout' : 'regulation'}
      />

      {modalState && (
        <NewEventModal
          match={match}
          mode={isShootoutView ? 'shootout' : 'regulation'}
          currentMinute={currentMinute}
          presetEventType={modalState.presetEventType}
          onClose={() => setModalState(null)}
        />
      )}

      {endConfirmOpen && (
        <ModalConfirmation
          description='Želite li završiti utakmicu?'
          boldText='Utakmica će biti deaktivirana.'
          icon={CheckBlack}
          circleVariant='green'
          onCancel={() => setEndConfirmOpen(false)}
          onConfirm={() => {
            setEndConfirmOpen(false);
            handleEndMatch();
          }}
        />
      )}

      {penaltyConfirmOpen && (
        <ModalConfirmation
          description='Želite li započeti izvođenje kaznenih udaraca?'
          boldText='Tajmer će biti zaustavljen.'
          icon={HistoryBlack}
          circleVariant='gray'
          onCancel={() => setPenaltyConfirmOpen(false)}
          onConfirm={() => {
            if (isRunning) toggle();
            setIsShootoutView(true);
            setPenaltyConfirmOpen(false);
          }}
        />
      )}
    </div>
  );
};
