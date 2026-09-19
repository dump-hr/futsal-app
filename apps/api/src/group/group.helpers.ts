const GROUP_NAME_PREFIX = /^skupina\s*/i;

export const normalizeGroupName = (name: string): string =>
  name.replace(GROUP_NAME_PREFIX, '').trim().toUpperCase();
