import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LocationProvider } from './LocationProvider';
import { ThemeProvider } from './ThemeProvider';
import type { ReactNode } from 'react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});


interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
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
