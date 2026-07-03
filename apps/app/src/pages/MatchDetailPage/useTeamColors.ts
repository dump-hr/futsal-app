import { useEffect, useState } from 'react';

const HOME_FALLBACK = '#7d1f01';
const AWAY_FALLBACK = '#214700';
const SAMPLE_SIZE = 64;
const MIN_ALPHA = 128;
const MIN_SATURATION = 40;
const MAX_BRIGHTNESS = 125;

const extractDominantColor = async (
  url: string,
  fallback: string,
): Promise<string> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return fallback;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      return await new Promise<string>((resolve) => {
        const img = new Image();
        img.onerror = () => resolve(fallback);
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = SAMPLE_SIZE;
            canvas.height = SAMPLE_SIZE;
            const ctx = canvas.getContext('2d');
            if (!ctx) return resolve(fallback);

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

            if (count === 0) return resolve(fallback);

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
            resolve(fallback);
          }
        };
        img.src = objectUrl;
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return fallback;
  }
};

export const useTeamColors = (
  homeLogoUrl?: string | null,
  awayLogoUrl?: string | null,
): [string, string] => {
  const [colors, setColors] = useState<[string, string]>([
    HOME_FALLBACK,
    AWAY_FALLBACK,
  ]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      homeLogoUrl
        ? extractDominantColor(homeLogoUrl, HOME_FALLBACK)
        : Promise.resolve(HOME_FALLBACK),
      awayLogoUrl
        ? extractDominantColor(awayLogoUrl, AWAY_FALLBACK)
        : Promise.resolve(AWAY_FALLBACK),
    ]).then(([home, away]) => {
      if (!cancelled) setColors([home, away]);
    });

    return () => {
      cancelled = true;
    };
  }, [homeLogoUrl, awayLogoUrl]);

  return colors;
};
