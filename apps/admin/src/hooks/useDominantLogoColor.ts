import { useEffect, useState } from 'react';
import {
  getDominantLogoColor,
  PLACEHOLDER_DOMINANT_COLOR,
} from '@helpers/logoColor';

export const useDominantLogoColor = (logoUrl?: string | null) => {
  const [color, setColor] = useState(PLACEHOLDER_DOMINANT_COLOR);

  useEffect(() => {
    setColor(PLACEHOLDER_DOMINANT_COLOR);

    if (!logoUrl) return;

    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      if (cancelled) return;
      setColor(getDominantLogoColor(image) ?? PLACEHOLDER_DOMINANT_COLOR);
    };
    image.src = logoUrl;

    return () => {
      cancelled = true;
    };
  }, [logoUrl]);

  return color;
};
