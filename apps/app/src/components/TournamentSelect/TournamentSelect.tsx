import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowDownWhite } from '@assets/index';
import { useCloseComponent, useTournamentContext } from '@hooks/index';
import { useTournamentsGet } from '@api/index';
import d from '@components/Dropdown/Dropdown.module.scss';
import c from './TournamentSelect.module.scss';

type TournamentSelectProps = {
  className?: string;
};

export const TournamentSelect = ({ className }: TournamentSelectProps) => {
  const { tournamentId, selectTournament } = useTournamentContext();

  const { data: tournaments = [] } = useTournamentsGet();

  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const [alignUp, setAlignUp] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useCloseComponent({ onClose: closeDropdown, containerRef: wrapperRef });

  useLayoutEffect(() => {
    if (!isOpen) {
      setAlignRight(false);
      setAlignUp(false);
      return;
    }
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (!rect) return;

    setAlignRight(rect.right > window.innerWidth - 8);
    setAlignUp(rect.bottom > window.innerHeight - 8);
  }, [isOpen]);

  const selected = tournaments.find((t) => t.id === tournamentId);

  if (!selected) return null;

  const handleSelect = (id: number) => {
    selectTournament(id);
    setIsOpen(false);
  };

  return (
    <div className={clsx(d.wrapper, c.wrapper, className)} ref={wrapperRef}>
      <button
        type='button'
        className={clsx(c.trigger, isOpen && c.open)}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}>
        <span className={c.label} title={selected.name}>
          {selected.name}
        </span>
        <img
          src={ArrowDownWhite}
          alt=''
          className={clsx(c.arrow, isOpen && c.rotated)}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          role='listbox'
          className={clsx(
            d.dropdown,
            alignRight && d.dropdownRight,
            alignUp && d.dropdownUp,
          )}>
          {tournaments.map((tournament) => (
            <button
              key={tournament.id}
              type='button'
              role='option'
              aria-selected={tournament.id === tournamentId}
              className={clsx(
                d.option,
                tournament.id === tournamentId && d.selected,
              )}
              onClick={() => handleSelect(tournament.id)}>
              {tournament.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
