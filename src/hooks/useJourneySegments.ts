import { useQuery } from '@tanstack/react-query';
import { tripPlannerService } from '../services/tripPlannerService';
import type { TripPlanningRequest, JourneySegment } from '../services/tripPlannerService';

interface UseJourneySegmentsOptions {
  enabled?: boolean;
  staleTime?: number;
  gcTime?: number;
  retry?: number;
}

interface UseJourneySegmentsReturn {
  journeySegments: JourneySegment[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook that wraps journey segments fetching with React Query
 * Provides journey segments data with caching, loading states, and error handling
 */
export function useJourneySegments(
  request: TripPlanningRequest,
  options: UseJourneySegmentsOptions = {}
): UseJourneySegmentsReturn {
  const {
    enabled = true,
    staleTime = 1000 * 60 * 5, // 5 minutes
    gcTime = 1000 * 60 * 60, // 1 hour
    retry = 3,
  } = options;

  const {
    data: journeySegments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['journey-segments', request.destination, request.departureCity],
    queryFn: async () => {
      const segments = await tripPlannerService.getJourneySegments(request);
      return segments;
    },
    enabled,
    staleTime,
    gcTime,
    retry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  return {
    journeySegments,
    isLoading,
    isError,
    error: error as Error | null,
    refetch,
  };
}
