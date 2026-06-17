export const SESSION_EXPIRED_MESSAGE =
  'Vaša sesija je istekla, molimo prijavite se ponovno.';

export const getJwtExpiryMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return 0;
  }
};
