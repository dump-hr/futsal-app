export const formatMatchDate = (isoString: string): string => {
  const date = new Date(isoString);
  const days = ['NEDJELJA', 'PONEDJELJAK', 'UTORAK', 'SRIJEDA', 'ČETVRTAK', 'PETAK', 'SUBOTA'];
  const day = days[date.getDay()];
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${day}, ${d}/${m} - ${h}:${min}`;
};
