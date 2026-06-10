import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'wouter';
import { routes } from '@routes/index';
import { SESSION_EXPIRED_MESSAGE } from './jwtHelpers';

type UseJwtExpiryWatcherParams = {
  token: string | null;
  expiryMs: number | null;
  isExpired: boolean;
};

export const useJwtExpiryWatcher = ({
  token,
  expiryMs,
  isExpired,
}: UseJwtExpiryWatcherParams) => {
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!token) return;
    if (isExpired) {
      toast.error(SESSION_EXPIRED_MESSAGE);
      return;
    }
    if (!expiryMs) return;
    const timer = setTimeout(() => {
      localStorage.removeItem('jwt');
      toast.error(SESSION_EXPIRED_MESSAGE);
      navigate(routes.LOGIN);
    }, expiryMs - Date.now());
    return () => clearTimeout(timer);
  }, [token, expiryMs, isExpired, navigate]);
};
