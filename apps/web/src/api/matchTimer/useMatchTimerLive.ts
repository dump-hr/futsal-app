// Subscribes to /match/:id/timer/stream via SSE and exposes a smoothly-ticking
// elapsedSeconds + isRunning. Read-only counterpart of useMatchTimer.
//
// Currently has no in-app consumer — it lives here so the SSE substrate is
// exercisable end-to-end before the public live-game viewer page lands.
// That page will be the first caller.

import { useEffect, useRef, useState } from 'react';
import { MatchTimerStateDto } from '@futsal-app/types';

type LiveSnapshot = {
  isRunning: boolean;
  accumulatedMs: number;
  startedAtClientEpoch: number | null;
};

const TICK_INTERVAL_MS = 250;

const computeElapsedSeconds = (snapshot: LiveSnapshot): number => {
  const elapsedMs =
    snapshot.accumulatedMs +
    (snapshot.isRunning && snapshot.startedAtClientEpoch != null
      ? Date.now() - snapshot.startedAtClientEpoch
      : 0);
  return Math.floor(elapsedMs / 1000);
};

export const useMatchTimerLive = (matchId: number) => {
  const [snapshot, setSnapshot] = useState<LiveSnapshot>({
    isRunning: false,
    accumulatedMs: 0,
    startedAtClientEpoch: null,
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const snapshotRef = useRef(snapshot);
  snapshotRef.current = snapshot;

  useEffect(() => {
    if (!matchId) return;

    const source = new EventSource(`/api/match/${matchId}/timer/stream`);
    source.onmessage = (event) => {
      try {
        const state = JSON.parse(event.data) as MatchTimerStateDto;
        const startedAtMs = state.startedAt
          ? new Date(state.startedAt).getTime()
          : null;
        const next: LiveSnapshot = {
          isRunning: state.isRunning,
          accumulatedMs: state.accumulatedMs,
          startedAtClientEpoch:
            state.isRunning && startedAtMs != null ? startedAtMs : null,
        };
        setSnapshot(next);
        setElapsedSeconds(computeElapsedSeconds(next));
      } catch {
        console.error('Failed to parse timer state event', event.data);
      }
    };
    return () => source.close();
  }, [matchId]);

  useEffect(() => {
    if (!snapshot.isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds(computeElapsedSeconds(snapshotRef.current));
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [snapshot.isRunning]);

  return { elapsedSeconds, isRunning: snapshot.isRunning };
};

export default useMatchTimerLive;
