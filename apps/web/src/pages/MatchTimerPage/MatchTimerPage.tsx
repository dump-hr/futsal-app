import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { EventType } from '@futsal-app/types';
import {
  useMatchGet,
  useMatchEventsGet,
  useMatchDeactivate,
} from '@api/index';
import { ModalConfirmation, NewEventModal } from '@components/index';
import { useMatchTimer } from '@hooks/index';
import { CheckBlack, HistoryBlack } from '@assets/icons';
import { routes } from '@routes/routes';
import MatchTimerHeader from './MatchTimerHeader';
import TimerView from './TimerView';
import ShootoutView from './ShootoutView';
import EventsColumns from './EventsColumns';
import c from './MatchTimerPage.module.scss';

type ModalState = {
  presetEventType?: EventType;
  presetIsForHomeTeam?: boolean;
} | null;

const REGULATION_HOTKEYS: Record<string, EventType> = {
  g: EventType.goal,
  a: EventType.ownGoal,
  c: EventType.redCard,
  z: EventType.yellowCard,
  p: EventType.penaltyGoal,
};

const SHOOTOUT_HOTKEYS: Record<string, EventType> = {
  g: EventType.shootoutGoal,
  p: EventType.shootoutMiss,
};

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
};

export const MatchTimerPage = () => {
  const params = useParams<{ matchId: string }>();
  const matchId = Number(params.matchId);
  const [, navigate] = useLocation();

  const { data: match, isLoading } = useMatchGet(matchId);
  const { data: events = [] } = useMatchEventsGet(matchId);
  const { mutate: deactivate } = useMatchDeactivate();

  const { elapsedSeconds, isRunning, toggle, setElapsed } =
    useMatchTimer(matchId);

  const [isShootoutView, setIsShootoutView] = useState(false);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [endConfirmOpen, setEndConfirmOpen] = useState(false);
  const [penaltyConfirmOpen, setPenaltyConfirmOpen] = useState(false);

  const currentMinute = Math.floor(elapsedSeconds / 60);

  const shootoutCounts = useMemo(() => {
    let home = 0;
    let away = 0;
    for (const event of events) {
      if (event.eventType !== EventType.shootoutGoal) continue;
      if (event.isForHomeTeam) home += 1;
      else away += 1;
    }
    return { home, away };
  }, [events]);

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
        localStorage.removeItem(`matchTimer:${matchId}`);
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
          presetIsForHomeTeam={modalState.presetIsForHomeTeam}
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
