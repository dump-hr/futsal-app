export const BackgroundColor = {
  Transparent: 'transparent',
  Lime: '#b3ff3b',
  White: '#ffffff',
  Red: '#f14531',
} as const;

export type BackgroundColor =
  (typeof BackgroundColor)[keyof typeof BackgroundColor];
