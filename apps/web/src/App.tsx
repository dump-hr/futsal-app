import '@/styles/_fonts.scss';
import './App.scss';

import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Router } from './Router';
import { TournamentProvider } from 'context/TournamentProvider';

export const App = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <TournamentProvider>
        <Router />
        <Toaster />
      </TournamentProvider>
    </ErrorBoundary>
  );
};
