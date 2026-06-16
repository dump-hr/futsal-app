import { useRef } from 'react';
import clsx from 'clsx';
import type { PlayerDto } from '@futsal-app/types';
import { Input } from '@components/index';
import { useCloseComponent, useSuggestions } from '@hooks/index';
import c from './PlayerAutocomplete.module.scss';

type PlayerAutocompleteProps = {
  players: PlayerDto[];
  onSelect: (player: PlayerDto | null) => void;
  initialQuery?: string;
  placeholder?: string;
  align?: 'left' | 'right';
  selectOnFocus?: boolean;
  onQueryChange?: () => void;
};

export const PlayerAutocomplete: React.FC<PlayerAutocompleteProps> = ({
  players,
  onSelect,
  initialQuery,
  placeholder,
  align = 'left',
  selectOnFocus = false,
  onQueryChange,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const {
    suggestions,
    showSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    inputProps,
    selectItem,
    closeSuggestions,
  } = useSuggestions<PlayerDto>({
    items: players,
    initialQuery,
    filterFn: (p, q) =>
      p.firstName.toLowerCase().includes(q) ||
      p.lastName.toLowerCase().includes(q),
    getLabel: (p) =>
      p ? `${p.firstName} ${p.lastName}` : 'Nepoznat netko',
    onSelect,
  });

  useCloseComponent({ onClose: closeSuggestions, containerRef: wrapperRef });

  const isRight = align === 'right';

  return (
    <div ref={wrapperRef} className={c.wrapper}>
      <Input
        placeholder={placeholder}
        {...inputProps}
        onChange={(e) => {
          onQueryChange?.();
          inputProps.onChange(e);
        }}
        onFocus={(e) => {
          inputProps.onFocus();
          if (selectOnFocus) e.currentTarget.select();
        }}
        style={{ maxWidth: '100%' }}
      />
      {showSuggestions && (
        <div className={clsx(c.suggestions, isRight && c.suggestionsRight)}>
          {[
            ...suggestions.map((player) => ({
              key: String(player.id),
              item: player as PlayerDto | null,
              label: `${player.firstName} ${player.lastName}`,
            })),
            {
              key: 'unknown',
              item: null as PlayerDto | null,
              label: 'Nepoznat netko',
            },
          ].map((option, index) => (
            <button
              key={option.key}
              type='button'
              className={clsx(
                c.suggestionItem,
                isRight && c.suggestionItemRight,
                highlightedIndex === index && c.suggestionItemHighlighted,
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => selectItem(option.item)}>
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
