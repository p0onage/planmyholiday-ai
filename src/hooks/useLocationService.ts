import { useQuery } from '@tanstack/react-query';
import { locationService } from '../services/locationService';
import type { UseLocationOptions, UseLocationReturn } from '../types/location';

/**
 * Custom hook that wraps location service with React Query
 * Provides comprehensive location data including currency, country, language, etc.
 */
export function useLocationService(options: UseLocationOptions = {}): UseLocationReturn {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 60, // 1 hour
    gcTime = 1000 * 60 * 60 * 24, // 24 hours
    retry = 3,
  } = options;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['user-location'],
    queryFn: async () => {
      const response = await locationService.getUserLocation();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch location data');
      }
      return response.data;
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    currency: data ? {
      code: data.currency.code,
      name: data.currency.name,
      symbol: data.currency.symbol,
    } : null,
    location: data ? {
      country: data.country_name,
      city: data.city,
      countryCode: data.country_code2,
      state: data.state_prov,
    } : null,
    language: data?.languages || null,
    timezone: data ? {
      name: data.time_zone.name,
      offset: data.time_zone.offset,
    } : null,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}

