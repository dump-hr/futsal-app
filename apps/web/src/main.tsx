import 'reflect-metadata';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TournamentProvider } from 'context/TournamentProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TournamentProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TournamentProvider>
  </StrictMode>,
);
