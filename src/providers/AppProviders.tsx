import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { LocationProvider } from './LocationProvider';
import { ThemeProvider } from './ThemeProvider';
import type { ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Create a persister for localStorage
const localStoragePersister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: 'planmyholiday-query-cache',
});

// Persist the query client
persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
  buster: '', // Optional: add a version buster to invalidate cache when needed
});


interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocationProvider>
          {children}
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
