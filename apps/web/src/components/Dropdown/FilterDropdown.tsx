import { useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import { ArrowDownWhite } from '@assets/index';
import { useCloseComponent } from '@hooks/index';
import c from './Dropdown.module.scss';

type FilterOption<T extends string> = {
  label: string;
  value: T;
};

type FilterDropdownProps<T extends string> = {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  variant?: 'filter' | 'default';
  placeholder?: string;
  className?: string;
};

export const FilterDropdown = <T extends string>({
  value,
  options,
  onChange,
  variant = 'filter',
  placeholder,
  className,
}: FilterDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => setIsOpen(false), []);
  useCloseComponent({ onClose: closeDropdown, containerRef: wrapperRef });

  const selectedLabel =
    options.find((o) => o.value === value)?.label ?? placeholder ?? '';

  const handleSelect = (optionValue: T) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const isDefault = variant === 'default';

  const wrapperClass = isDefault ? c.defaultWrapper : c.filterWrapper;
  const triggerClass = clsx(
    isDefault ? c.defaultTrigger : c.filterTrigger,
    isOpen && (isDefault ? c.defaultOpen : c.filterOpen),
  );

  return (
    <div className={clsx(wrapperClass, className)} ref={wrapperRef}>
      <button
        className={triggerClass}
        onClick={() => setIsOpen(!isOpen)}
        type='button'>
        <span className={c.selectedText}>{selectedLabel}</span>
        <img
          src={ArrowDownWhite}
          alt='arrow down'
          className={clsx(c.arrowIcon, isOpen && c.rotated)}
        />
      </button>
      {isOpen && (
        <div className={c.dropdown}>
          {options.map((option) => (
            <button
              key={option.value}
              className={c.option}
              onClick={() => handleSelect(option.value)}
              type='button'>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
