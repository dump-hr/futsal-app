import { useCallback, useRef } from 'react';

export const useDragScroll = <T extends HTMLElement = HTMLElement>() => {
  const cleanupRef = useRef<(() => void) | null>(null);

  return useCallback((node: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      isDown = true;
      startX = e.clientX;
      startScroll = node.scrollLeft;
      node.style.cursor = 'grabbing';
      node.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      node.scrollLeft = startScroll - (e.clientX - startX);
    };

    const stop = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      node.style.cursor = '';
      if (node.hasPointerCapture(e.pointerId)) {
        node.releasePointerCapture(e.pointerId);
      }
    };

    const onDragStart = (e: Event) => e.preventDefault();

    node.addEventListener('pointerdown', onPointerDown);
    node.addEventListener('pointermove', onPointerMove);
    node.addEventListener('pointerup', stop);
    node.addEventListener('pointercancel', stop);
    node.addEventListener('dragstart', onDragStart);

    cleanupRef.current = () => {
      node.removeEventListener('pointerdown', onPointerDown);
      node.removeEventListener('pointermove', onPointerMove);
      node.removeEventListener('pointerup', stop);
      node.removeEventListener('pointercancel', stop);
      node.removeEventListener('dragstart', onDragStart);
    };
  }, []);
};
