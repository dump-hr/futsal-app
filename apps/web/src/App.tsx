import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Router } from './Router';

export const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Router />
      <Toaster />
    </ErrorBoundary>
  );
};
