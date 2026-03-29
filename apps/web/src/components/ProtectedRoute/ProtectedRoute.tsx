import { Redirect } from 'wouter';
import { routes } from '@routes/routes';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem('jwt');
  if (!token) return <Redirect to={routes.LOGIN} />;
  return <>{children}</>;
};
