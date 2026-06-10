export const isInvalidName = (value: string): boolean => {
  const trimmed = value.trim();
  return trimmed.length < 2 || trimmed.length > 20;
};

export const getPlayerNameValidationError = (
  firstName: string,
  lastName: string,
): string => {
  if (!firstName && !lastName) return 'Unesite ime i prezime';
  if (!firstName) return 'Unesite ime';
  if (!lastName) return 'Unesite prezime';
  const fnBad = isInvalidName(firstName);
  const lnBad = isInvalidName(lastName);
  if (fnBad && lnBad)
    return 'Ime i prezime moraju imati između 2 i 20 znakova';
  if (fnBad) return 'Ime mora imati između 2 i 20 znakova';
  if (lnBad) return 'Prezime mora imati između 2 i 20 znakova';
  return '';
};
