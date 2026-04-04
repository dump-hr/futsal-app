const pad = (n: number) => String(n).padStart(2, '0');

export const formatLocalDate = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const formatLocalTime = (d: Date): string =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const validateTime = (time: string): string | null => {
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return 'Vrijeme mora biti u formatu HH:MM';
  if (Number(match[1]) > 23) return 'Sati moraju biti između 0 i 23';
  if (Number(match[2]) > 59) return 'Minute moraju biti između 0 i 59';
  return null;
};

export const formatMatchDate = (value: string | Date): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  const days = [
    'NEDJELJA',
    'PONEDJELJAK',
    'UTORAK',
    'SRIJEDA',
    'ČETVRTAK',
    'PETAK',
    'SUBOTA',
  ];
  const day = days[date.getDay()];
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const h = pad(date.getHours());
  const min = pad(date.getMinutes());
  return `${day}, ${d}/${m} - ${h}:${min}`;
};
