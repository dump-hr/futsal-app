export const PLACEHOLDER_DOMINANT_COLOR = '#8C8A8A';
export const COLOR_BUCKET_SIZE = 8;

export const toHex = (value: number) => value.toString(16).padStart(2, '0');

export const clampColorValue = (value: number) =>
  Math.min(255, Math.max(0, value));

export const getColorSaturation = (
  red: number,
  green: number,
  blue: number,
) => {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);

  if (max === 0) {
    return 0;
  }

  return (max - min) / max;
};

export const hexToRgba = (hex: string, alpha: number) => {
  const normalizedHex = hex.replace('#', '');
  const red = parseInt(normalizedHex.slice(0, 2), 16);
  const green = parseInt(normalizedHex.slice(2, 4), 16);
  const blue = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

export const getDominantLogoColor = (image: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', { willReadFrequently: true });

  if (!context) {
    return null;
  }

  const size = 80;
  canvas.width = size;
  canvas.height = size;
  context.drawImage(image, 0, 0, size, size);

  const { data } = context.getImageData(0, 0, size, size);
  const colorScores = new Map<string, number>();

  for (let index = 0; index < data.length; index += 4) {
    const alpha = data[index + 3];

    if (alpha < 128) {
      continue;
    }

    const red = data[index];
    const green = data[index + 1];
    const blue = data[index + 2];

    if (red > 245 && green > 245 && blue > 245) {
      continue;
    }

    const maxChannel = Math.max(red, green, blue);
    const saturation = getColorSaturation(red, green, blue);

    if (maxChannel < 64 || saturation < 0.25) {
      continue;
    }

    const bucketedRed = clampColorValue(
      Math.round(red / COLOR_BUCKET_SIZE) * COLOR_BUCKET_SIZE,
    );
    const bucketedGreen = clampColorValue(
      Math.round(green / COLOR_BUCKET_SIZE) * COLOR_BUCKET_SIZE,
    );
    const bucketedBlue = clampColorValue(
      Math.round(blue / COLOR_BUCKET_SIZE) * COLOR_BUCKET_SIZE,
    );
    const color = `#${toHex(bucketedRed)}${toHex(bucketedGreen)}${toHex(bucketedBlue)}`;
    const score = saturation * Math.max(red, green, blue);

    colorScores.set(color, (colorScores.get(color) ?? 0) + score);
  }

  let dominantColor: string | null = null;
  let highestScore = 0;

  colorScores.forEach((score, color) => {
    if (score > highestScore) {
      dominantColor = color;
      highestScore = score;
    }
  });

  return dominantColor;
};
