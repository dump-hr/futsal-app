import '@/styles/_fonts.scss';
import './App.scss';

import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Router } from './Router';
import { TournamentProvider } from '@context/index';
import { ErrorPage } from '@pages/index';

export const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorPage}>
      <Toaster />
      <TournamentProvider>
        <Router />
      </TournamentProvider>
    </ErrorBoundary>
  );
};
