import { useQuery } from '@tanstack/react-query';
import { tripPlannerService } from '../services/tripPlannerService';
import type { TripPlanningRequest, TransportOption } from '../services/tripPlannerService';

interface UseTransportOptionsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number;
}

interface UseTransportOptionsReturn {
  transportOptions: TransportOption[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook that wraps transport options fetching with React Query
 * Provides transport options for a specific journey segment with caching, loading states, and error handling
 */
export function useTransportOptions(
  request: TripPlanningRequest,
  segmentId: string,
  options: UseTransportOptionsOptions = {}
): UseTransportOptionsReturn {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    gcTime = 1000 * 60 * 60, // 1 hour
    retry = 3,
  } = options;

  const {
    data: transportOptions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['transport-options', request.destination, request.departureCity, segmentId],
    queryFn: async () => {
      const options = await tripPlannerService.getTransportOptionsForSegment(request, segmentId);
      return options;
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    transportOptions,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}
