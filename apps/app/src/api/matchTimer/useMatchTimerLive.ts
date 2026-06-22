import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MatchTimerStateDto } from '@futsal-app/types';
import { getElapsedMs } from '@helpers/index';
import { TICK_INTERVAL_MS } from '@constants/timer';

const IDLE_STATE: MatchTimerStateDto = {
  matchId: 0,
  isRunning: false,
  accumulatedMs: 0,
  startedAt: null,
  lastSyncedAt: null,
};

const toElapsedSeconds = (state: MatchTimerStateDto): number =>
  Math.floor(getElapsedMs(state) / 1000);

export const useMatchTimerLive = (matchId: number) => {
  const [state, setState] = useState<MatchTimerStateDto>(IDLE_STATE);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!matchId) {
      setState(IDLE_STATE);
      setElapsedSeconds(0);
      return;
    }

    const source = new EventSource(`/api/match/${matchId}/timer/stream`);
    source.onmessage = (event) => {
      try {
        const next = JSON.parse(event.data) as MatchTimerStateDto;
        setState(next);
        setElapsedSeconds(toElapsedSeconds(next));
      } catch {
        toast.error('Greška pri ažuriranju tajmera');
      }
    };
    return () => source.close();
  }, [matchId]);

  useEffect(() => {
    if (!state.isRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds(toElapsedSeconds(stateRef.current));
    }, TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [state.isRunning]);

  return { elapsedSeconds, isRunning: state.isRunning };
};
