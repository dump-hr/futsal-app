import { useEffect, useRef } from 'react';

type UseModalAccessibilityProps = {
  onClose: () => void;
};

const useModalAccessibility = ({ onClose }: UseModalAccessibilityProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

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

export default useModalAccessibility;
