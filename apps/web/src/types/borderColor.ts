export const BorderColor = {
  Gray: '#5c5c5c',
  Lime: '#b3ff3b',
  White: '#ffffff',
  Red: '#f14531',
} as const;

export type BorderColor = (typeof BorderColor)[keyof typeof BorderColor];
