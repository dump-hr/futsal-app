const GROUP_NAME_PREFIX = /^skupina\s*/i;
const GROUP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const normalizeGroupName = (name: string): string =>
  name.replace(GROUP_NAME_PREFIX, '').trim().toUpperCase();

export const formatGroupName = (name: string): string => `Skupina ${name}`;

export const getNextGroupName = (existingNames: string[]): string => {
  const taken = new Set(existingNames.map(normalizeGroupName));
  return GROUP_LETTERS.find((letter) => !taken.has(letter)) ?? '';
};
