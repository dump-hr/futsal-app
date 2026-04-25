import { Redirect } from 'wouter';
import { useAuthVerify } from '@api/auth/useAuthVerify';
import { routes } from '@routes/routes';
import { getJwtExpiryMs } from './jwtHelpers';
import { useJwtExpiryWatcher } from './useJwtExpiryWatcher';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('jwt');
  const expiryMs = token ? getJwtExpiryMs(token) : null;
  const isExpired = expiryMs !== null && expiryMs <= Date.now();

  const verifyEnabled = !!token && !isExpired;
  const { isPending: isVerifying, isError: verifyFailed } =
    useAuthVerify(verifyEnabled);

  useJwtExpiryWatcher({ token, expiryMs, isExpired });

  if (!token || isExpired) {
    localStorage.removeItem('jwt');
    return <Redirect to={routes.LOGIN} />;
  }
  if (verifyFailed) return <Redirect to={routes.LOGIN} />;
  if (verifyEnabled && isVerifying) return null;
  return <>{children}</>;
};
