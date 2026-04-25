import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Redirect, useLocation } from 'wouter';
import { useAuthVerify } from '@api/auth/useAuthVerify';
import { routes } from '@routes/routes';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const SESSION_EXPIRED_MESSAGE =
  'Vaša sesija je istekla, molimo prijavite se ponovno.';

const getJwtExpiryMs = (token: string): number | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return 0;
  }
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [, navigate] = useLocation();
  const token = localStorage.getItem('jwt');
  const expiryMs = token ? getJwtExpiryMs(token) : null;
  const isExpired = expiryMs !== null && expiryMs <= Date.now();

  const verifyEnabled = !!token && !isExpired;
  const { isPending: isVerifying, isError: verifyFailed } =
    useAuthVerify(verifyEnabled);

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

  if (!token || isExpired) {
    if (token) localStorage.removeItem('jwt');
    return <Redirect to={routes.LOGIN} />;
  }
  if (verifyFailed) return <Redirect to={routes.LOGIN} />;
  if (verifyEnabled && isVerifying) return null;
  return <>{children}</>;
};
