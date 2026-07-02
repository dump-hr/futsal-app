import { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowDownWhite } from '@assets/index';
import { EventType } from '@futsal-app/types';
import { useCloseComponent } from '@hooks/index';
import { EVENT_LABELS } from '@types';
import c from './Dropdown.module.scss';

const REGULAR_EVENTS: EventType[] = [
  EventType.goal,
  EventType.ownGoal,
  EventType.yellowCard,
  EventType.redCard,
  EventType.injury,
  EventType.penaltyGoal,
  EventType.penaltyMiss,
];

const PENALTY_SHOOTOUT_EVENTS: EventType[] = [
  EventType.shootoutGoal,
  EventType.shootoutMiss,
];

type EventDropdownProps = {
  side: 'left' | 'right';
  isPenaltyShootout?: boolean;
  value: `${EventType}` | null;
  onChange: (event: `${EventType}`) => void;
  className?: string;
};

export const EventDropdown: React.FC<EventDropdownProps> = ({
  side,
  isPenaltyShootout = false,
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const events = isPenaltyShootout ? PENALTY_SHOOTOUT_EVENTS : REGULAR_EVENTS;

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useCloseComponent({
    onClose: closeDropdown,
    containerRef: wrapperRef,
    enabled: isOpen,
  });

  const handleSelect = (event: EventType) => {
    onChange(event);
    setIsOpen(false);
  };

  const sideClass = side === 'left' ? c.triggerLeft : c.triggerRight;
  const optionAlign = side === 'left' ? c.optionLeft : c.optionRight;

  return (
    <div className={clsx(c.wrapper, className)} ref={wrapperRef}>
      <button
        className={clsx(c.trigger, sideClass)}
        onClick={() => setIsOpen(!isOpen)}
        type='button'>
        <img
          src={ArrowDownWhite}
          alt='arrow down'
          className={clsx(c.arrowIcon, isOpen && c.rotated)}
        />
        <span className={c.selectedText}>
          {value ? EVENT_LABELS[value] : 'Odaberi događaj'}
        </span>
      </button>
      {isOpen && (
        <div className={c.dropdown}>
          {events.map((event) => (
            <button
              key={event}
              className={clsx(c.option, optionAlign)}
              onClick={() => handleSelect(event)}
              type='button'>
              {EVENT_LABELS[event]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
