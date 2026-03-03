import { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';

type UseSuggestionsOptions<T> = {
  items: T[];
  filterFn: (item: T, query: string) => boolean;
  onSelect: (item: T | null) => void;
  getLabel: (item: T | null) => string;
  initialQuery?: string;
};

const useSuggestions = <T>({
  items,
  filterFn,
  onSelect,
  getLabel,
  initialQuery = '',
}: UseSuggestionsOptions<T>) => {
  const [query, setQuery] = useState(initialQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const suggestions = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter((item) => filterFn(item, q));
  }, [items, query, filterFn]);

  const handleSelect = (item: T | null) => {
    setQuery(getLabel(item));
    onSelect(item);
    setShowSuggestions(false);
  };

  const inputProps = {
    value: query,
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      setShowSuggestions(true);
      setHighlightedIndex(0);
    },
    onFocus: () => {
      setShowSuggestions(true);
      setHighlightedIndex(0);
    },
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions) return;
      const itemCount = suggestions.length + 1;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % itemCount);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + itemCount) % itemCount);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex < suggestions.length) {
          handleSelect(suggestions[highlightedIndex]);
        } else {
          handleSelect(null);
        }
      }
    },
  };

  const closeSuggestions = () => setShowSuggestions(false);

  return {
    query,
    setQuery,
    suggestions,
    showSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    inputProps,
    selectItem: handleSelect,
    closeSuggestions,
  };
};

export default useSuggestions;
