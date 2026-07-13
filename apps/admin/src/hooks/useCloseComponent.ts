import { useEffect, useRef, type RefObject } from 'react';

type UseCloseComponentProps = {
  onClose: () => void;
  containerRef?: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

const escapeStack: Array<() => void> = [];

export const useCloseComponent = ({
  onClose,
  containerRef,
  enabled = true,
}: UseCloseComponentProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!enabled) return;

    const entry = () => onCloseRef.current();
    escapeStack.push(entry);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' && e.key !== 'Esc') return;
      if (escapeStack[escapeStack.length - 1] === entry) entry();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      const index = escapeStack.indexOf(entry);
      if (index !== -1) escapeStack.splice(index, 1);
    };
  }, [enabled]);

  useEffect(() => {
    if (!containerRef?.current) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, containerRef]);

  useEffect(() => {
    if (overlayRef.current && firstRenderRef.current) {
      const dialog = overlayRef.current.querySelector(
        '[role="dialog"]',
      ) as HTMLElement | null;
      if (dialog) dialog.focus();
      firstRenderRef.current = false;
    }
  }, []);

  return { overlayRef };
};
