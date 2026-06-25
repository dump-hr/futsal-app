import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ArrowDownBlack, ArrowDownWhite } from '@assets/index';
import { useCloseComponent } from '@hooks/index';
import c from './Filter.module.scss';

export type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type FilterProps<T extends string> = {
  label: string;
  value: T | null;
  options: FilterOption<T>[];
  onChange: (value: T | null) => void;
  className?: string;
};

export const Filter = <T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: FilterProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useCloseComponent({ onClose: closeDropdown, containerRef: wrapperRef });

  useLayoutEffect(() => {
    if (!isOpen) {
      setAlignRight(false);
      return;
    }
    const rect = dropdownRef.current?.getBoundingClientRect();
    if (rect) setAlignRight(rect.right > window.innerWidth - 8);
  }, [isOpen]);

  const isActive = value !== null;
  const selectedLabel = isActive
    ? (options.find((o) => o.value === value)?.label ?? label)
    : label;

  const handleSelect = (optionValue: T) => {
    onChange(optionValue === value ? null : optionValue);
    setIsOpen(false);
  };

  return (
    <div className={clsx(c.wrapper, className)} ref={wrapperRef}>
      <button
        type='button'
        className={clsx(c.trigger, isActive ? c.active : c.default)}
        onClick={() => setIsOpen((prev) => !prev)}>
        <span className={c.label}>{selectedLabel}</span>
        <img
          src={isActive ? ArrowDownBlack : ArrowDownWhite}
          alt='arrow down'
          className={clsx(c.arrow, isOpen && c.rotated)}
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={clsx(c.dropdown, alignRight && c.dropdownRight)}>
          {options.map((option) => (
            <button
              key={option.value}
              type='button'
              className={clsx(c.option, option.value === value && c.selected)}
              onClick={() => handleSelect(option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
