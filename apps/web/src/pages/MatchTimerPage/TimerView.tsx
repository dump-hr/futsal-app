import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { CheckBlack, HistoryBlack, PlusBlack } from '@assets/icons';
import { Button } from '@components/Button';
import c from './MatchTimerPage.module.scss';

type TimerViewProps = {
  homeGoals: number;
  awayGoals: number;
  elapsedSeconds: number;
  isRunning: boolean;
  onElapsedChange: (seconds: number) => void;
  onOpenNewEvent: () => void;
  onTogglePenalty: () => void;
  onEndMatch: () => void;
};

const pad = (n: number) => String(n).padStart(2, '0');
const clamp = (n: number, max: number) => Math.max(0, Math.min(max, n));

type EditingField = 'minutes' | 'seconds' | null;

export const TimerView: React.FC<TimerViewProps> = ({
  homeGoals,
  awayGoals,
  elapsedSeconds,
  isRunning,
  onElapsedChange,
  onOpenNewEvent,
  onTogglePenalty,
  onEndMatch,
}) => {
  const [editing, setEditing] = useState<EditingField>(null);
  const [draft, setDraft] = useState('');

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  useEffect(() => {
    if (isRunning) setEditing(null);
  }, [isRunning]);

  const startEdit = (field: EditingField, current: number) => {
    if (isRunning || !field) return;
    setEditing(field);
    setDraft(String(current));
  };

  const commit = () => {
    if (!editing) return;
    const parsed = Number(draft);
    if (Number.isFinite(parsed)) {
      const safe = clamp(Math.floor(parsed), editing === 'minutes' ? 999 : 59);
      const newMinutes = editing === 'minutes' ? safe : minutes;
      const newSeconds = editing === 'seconds' ? safe : seconds;
      onElapsedChange(newMinutes * 60 + newSeconds);
    }
    setEditing(null);
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditing(null);
      setDraft('');
    }
  };

  return (
    <div className={c.timerSection}>
      <div className={c.score}>
        {homeGoals} - {awayGoals}
      </div>
      <div className={c.clock}>
        {editing === 'minutes' ? (
          <input
            className={c.clockInput}
            value={draft}
            autoFocus
            onChange={(e) =>
              setDraft(e.target.value.replace(/\D/g, '').slice(0, 3))
            }
            onBlur={commit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className={clsx(c.clockDigits, !isRunning && c.clickable)}
            onClick={() => startEdit('minutes', minutes)}>
            {pad(minutes)}
          </span>
        )}
        <span className={c.clockColon}>:</span>
        {editing === 'seconds' ? (
          <input
            className={c.clockInput}
            value={draft}
            autoFocus
            onChange={(e) =>
              setDraft(e.target.value.replace(/\D/g, '').slice(0, 2))
            }
            onBlur={commit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className={clsx(c.clockDigits, !isRunning && c.clickable)}
            onClick={() => startEdit('seconds', seconds)}>
            {pad(seconds)}
          </span>
        )}
      </div>

      <div className={c.actions}>
        <Button icon={PlusBlack} variant='primary' onClick={onOpenNewEvent}>
          Novi događaj
        </Button>
        <Button icon={HistoryBlack} variant='primary' onClick={onTogglePenalty}>
          Penali
        </Button>
        <Button icon={CheckBlack} variant='primary' onClick={onEndMatch}>
          Kraj utakmice
        </Button>
      </div>

      <div className={c.legend}>
        <span className={c.legendItem}>
          <span className={c.legendKey}>G</span>
          <span className={c.legendLabel}>GOL</span>
        </span>
        <span className={c.legendItem}>
          <span className={c.legendKey}>A</span>
          <span className={c.legendLabel}>AUTOGOL</span>
        </span>
        <span className={c.legendItem}>
          <span className={c.legendKey}>C</span>
          <span className={c.legendLabel}>CRVENI KARTON</span>
        </span>
        <span className={c.legendItem}>
          <span className={c.legendKey}>Z</span>
          <span className={c.legendLabel}>ŽUTI KARTON</span>
        </span>
        <span className={c.legendItem}>
          <span className={c.legendKey}>P</span>
          <span className={c.legendLabel}>PENAL</span>
        </span>
      </div>
    </div>
  );
};
