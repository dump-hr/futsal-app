import { useEffect, useState } from 'react';

const FALLBACK_COLOR = '#151515';
const SAMPLE_SIZE = 32;
const MIN_ALPHA = 128;
const MIN_SATURATION = 20;
const MAX_BRIGHTNESS = 120;

const extractDominantColor = (url: string): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onerror = () => resolve(FALLBACK_COLOR);
    img.onload = () => {
      // getImageData throws on CORS-tainted canvases
      try {
        const canvas = document.createElement('canvas');
        canvas.width = SAMPLE_SIZE;
        canvas.height = SAMPLE_SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(FALLBACK_COLOR);
          return;
        }

        ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < MIN_ALPHA) continue;

          const max = Math.max(data[i], data[i + 1], data[i + 2]);
          const min = Math.min(data[i], data[i + 1], data[i + 2]);
          if (max - min < MIN_SATURATION) continue;

          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count += 1;
        }

        if (count === 0) {
          resolve(FALLBACK_COLOR);
          return;
        }

        r /= count;
        g /= count;
        b /= count;

        const scale = Math.min(1, MAX_BRIGHTNESS / Math.max(r, g, b));
        const toHex = (value: number) =>
          Math.round(value * scale)
            .toString(16)
            .padStart(2, '0');

        resolve(`#${toHex(r)}${toHex(g)}${toHex(b)}`);
      } catch {
        resolve(FALLBACK_COLOR);
      }
    };
    img.src = url;
  });

export const useTeamColors = (
  homeLogoUrl?: string | null,
  awayLogoUrl?: string | null,
): [string, string] => {
  const [colors, setColors] = useState<[string, string]>([
    FALLBACK_COLOR,
    FALLBACK_COLOR,
  ]);

  useEffect(() => {
    let cancelled = false;

    const load = (url?: string | null) =>
      url ? extractDominantColor(url) : Promise.resolve(FALLBACK_COLOR);

    Promise.all([load(homeLogoUrl), load(awayLogoUrl)]).then(([home, away]) => {
      if (!cancelled) setColors([home, away]);
    });

    return () => {
      cancelled = true;
    };
  }, [homeLogoUrl, awayLogoUrl]);

  return colors;
};
