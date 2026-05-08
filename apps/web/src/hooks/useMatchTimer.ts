import { useCallback, useEffect, useRef, useState } from 'react';
import { useMatchTimerGet, useMatchTimerSync } from '@api/matchTimer';

type StoredTimerState = {
  startedAt: number | null;
  accumulatedMs: number;
  isRunning: boolean;
  lastWrittenAt: number;
};

const TICK_INTERVAL_MS = 250;
const HEARTBEAT_INTERVAL_MS = 5000;

const storageKey = (matchId: number) => `matchTimer:${matchId}`;

const emptyState = (): StoredTimerState => ({
  startedAt: null,
  accumulatedMs: 0,
  isRunning: false,
  lastWrittenAt: 0,
});

const readState = (matchId: number): StoredTimerState => {
  try {
    const raw = localStorage.getItem(storageKey(matchId));
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<StoredTimerState>;
    return {
      startedAt: parsed.startedAt ?? null,
      accumulatedMs: parsed.accumulatedMs ?? 0,
      isRunning: !!parsed.isRunning,
      lastWrittenAt: parsed.lastWrittenAt ?? 0,
    };
  } catch {
    return emptyState();
  }
};

const writeState = (
  matchId: number,
  state: Omit<StoredTimerState, 'lastWrittenAt'>,
): StoredTimerState => {
  const stamped: StoredTimerState = { ...state, lastWrittenAt: Date.now() };
  localStorage.setItem(storageKey(matchId), JSON.stringify(stamped));
  return stamped;
};

const elapsedMsFromState = (state: StoredTimerState): number => {
  if (state.isRunning && state.startedAt != null) {
    return state.accumulatedMs + (Date.now() - state.startedAt);
  }
  return state.accumulatedMs;
};

export const useMatchTimer = (matchId: number) => {
  const stateRef = useRef<StoredTimerState>(readState(matchId));
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    Math.floor(elapsedMsFromState(stateRef.current) / 1000),
  );
  const [isRunning, setIsRunning] = useState(stateRef.current.isRunning);

  const { mutate: syncMutate } = useMatchTimerSync(matchId);
  const syncMutateRef = useRef(syncMutate);
  syncMutateRef.current = syncMutate;

  const pushSync = useCallback((state: StoredTimerState) => {
    syncMutateRef.current({
      isRunning: state.isRunning,
      accumulatedMs: Math.max(0, Math.floor(elapsedMsFromState(state))),
    });
  }, []);

  // Mount-time reconciliation: if backend snapshot is newer than local, adopt it.
  const { data: backendState } = useMatchTimerGet(matchId);
  useEffect(() => {
    if (!backendState) return;
    const backendSyncedAt = backendState.lastSyncedAt
      ? new Date(backendState.lastSyncedAt).getTime()
      : 0;
    const local = stateRef.current;
    if (backendSyncedAt <= local.lastWrittenAt) return;

    const startedAtMs = backendState.startedAt
      ? new Date(backendState.startedAt).getTime()
      : null;
    const adopted = writeState(matchId, {
      startedAt: backendState.isRunning && startedAtMs ? startedAtMs : null,
      accumulatedMs: backendState.accumulatedMs,
      isRunning: backendState.isRunning,
    });
    stateRef.current = adopted;
    setIsRunning(adopted.isRunning);
    setElapsedSeconds(Math.floor(elapsedMsFromState(adopted) / 1000));
  }, [backendState, matchId]);

  useEffect(() => {
    const initial = readState(matchId);
    stateRef.current = initial;
    setIsRunning(initial.isRunning);
    setElapsedSeconds(Math.floor(elapsedMsFromState(initial) / 1000));
  }, [matchId]);

  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      setElapsedSeconds(
        Math.floor(elapsedMsFromState(stateRef.current) / 1000),
      );
    };
    tick();
    const interval = setInterval(tick, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Heartbeat: while running, push the current state to the backend every 5s
  // so the public stream stays fresh and a backend restart doesn't lose state.
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      pushSync(stateRef.current);
    }, HEARTBEAT_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isRunning, pushSync]);

  const toggle = useCallback(() => {
    const now = Date.now();
    const current = stateRef.current;
    let next: StoredTimerState;
    if (current.isRunning) {
      const accumulated =
        current.accumulatedMs +
        (current.startedAt != null ? now - current.startedAt : 0);
      next = writeState(matchId, {
        startedAt: null,
        accumulatedMs: accumulated,
        isRunning: false,
      });
      setIsRunning(false);
      setElapsedSeconds(Math.floor(accumulated / 1000));
    } else {
      next = writeState(matchId, {
        startedAt: now,
        accumulatedMs: current.accumulatedMs,
        isRunning: true,
      });
      setIsRunning(true);
    }
    stateRef.current = next;
    pushSync(next);
  }, [matchId, pushSync]);

  const setElapsed = useCallback(
    (seconds: number) => {
      const safe = Math.max(0, Math.floor(seconds));
      const current = stateRef.current;
      const next = writeState(matchId, {
        startedAt: current.isRunning ? Date.now() : null,
        accumulatedMs: safe * 1000,
        isRunning: current.isRunning,
      });
      stateRef.current = next;
      setElapsedSeconds(safe);
      pushSync(next);
    },
    [matchId, pushSync],
  );

  const clearTimer = useCallback(() => {
    localStorage.removeItem(storageKey(matchId));
    stateRef.current = emptyState();
    setIsRunning(false);
    setElapsedSeconds(0);
  }, [matchId]);

  return { elapsedSeconds, isRunning, toggle, setElapsed, clearTimer };
};

export default useMatchTimer;
