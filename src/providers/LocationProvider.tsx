import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { useLocationService } from '../hooks/useLocationService.ts';
import type { Currency, LocationInfo, Timezone } from '../types/location';

// Default currency
const DEFAULT_CURRENCY: Currency = {
  code: 'GBP',
  symbol: '£',
  name: 'British Pound'
};

// Context type
interface LocationContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  location: LocationInfo | null;
  language: string | null;
  timezone: Timezone | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

// Create context
const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Provider props
interface LocationProviderProps {
  children: ReactNode;
}

// Provider component
export function LocationProvider({ children }: LocationProviderProps) {
  const [currency, setCurrency] = useState<Currency>(DEFAULT_CURRENCY);
  const { 
    currency: detectedCurrency, 
    location, 
    language, 
    timezone, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useLocationService();

  // Use detected currency if available, otherwise keep current selection
  const currentCurrency = detectedCurrency || currency;

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    currency: currentCurrency,
    setCurrency,
    location,
    language,
    timezone,
    isLoading,
    isError,
    error,
    refetch,
  }), [currentCurrency, location, language, timezone, isLoading, isError, error, refetch]);

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

// Hook to use location context
export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}
