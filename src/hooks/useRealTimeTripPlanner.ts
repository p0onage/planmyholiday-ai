// Real-time Trip Planner Hook - Enhanced with JSON data and real-time updates
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripPlannerService } from '../services/tripPlannerService';
import type { 
  TripPlanningRequest
} from '../services/tripPlannerService';

interface UseRealTimeTripPlannerOptions {
  initialRequest: TripPlanningRequest;
  enableRealTimeUpdates?: boolean;
  debounceMs?: number;
}

interface TripPlanningState {
  currentRequest: TripPlanningRequest;
  selectedActivities: string[];
  selectedAccommodation: string[];
  selectedTransportation: string[];
  customInputs: {
    activities: string;
    accommodation: string;
    transportation: string;
  };
  refreshingSteps: {
    activities: boolean;
    accommodation: boolean;
    transportation: boolean;
  };
}

export function useRealTimeTripPlanner(options: UseRealTimeTripPlannerOptions) {
  const { 
    initialRequest, 
    enableRealTimeUpdates = true, 
    debounceMs = 500 
  } = options;

  const queryClient = useQueryClient();
  
  // State management
  const [state, setState] = useState<TripPlanningState>({
    currentRequest: initialRequest,
    selectedActivities: [],
    selectedAccommodation: [],
    selectedTransportation: [],
    customInputs: {
      activities: '',
      accommodation: '',
      transportation: ''
    },
    refreshingSteps: {
      activities: false,
      accommodation: false,
      transportation: false
    }
  });

  // Debounced request for real-time updates
  const [debouncedRequest, setDebouncedRequest] = useState(initialRequest);

  // Debounce effect for real-time updates
  useEffect(() => {
    if (!enableRealTimeUpdates) return;

    const timer = setTimeout(() => {
      setDebouncedRequest(state.currentRequest);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [state.currentRequest, debounceMs, enableRealTimeUpdates]);

  // Main trip plan query
  const tripPlanQuery = useQuery({
    queryKey: ['trip-plan', debouncedRequest],
    queryFn: () => tripPlannerService.generateTripPlan(debouncedRequest),
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Activities query with real-time filtering
  const activitiesQuery = useQuery({
    queryKey: ['activities', state.currentRequest, {
      activityTypes: state.currentRequest.preferences?.activityTypes,
      budget: state.currentRequest.budget
    }],
    queryFn: () => tripPlannerService.getActivities(state.currentRequest, {
      activityTypes: state.currentRequest.preferences?.activityTypes,
      budget: state.currentRequest.budget
    }),
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Accommodation query with real-time filtering
  const accommodationQuery = useQuery({
    queryKey: ['accommodation', state.currentRequest, {
      accommodationTypes: state.currentRequest.preferences?.accommodationTypes,
      budget: state.currentRequest.budget
    }],
    queryFn: () => tripPlannerService.getAccommodation(state.currentRequest, {
      accommodationTypes: state.currentRequest.preferences?.accommodationTypes,
      budget: state.currentRequest.budget
    }),
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Transportation query with real-time filtering
  const transportationQuery = useQuery({
    queryKey: ['transportation', state.currentRequest, {
      types: state.currentRequest.preferences?.transportationPreferences
    }],
    queryFn: () => tripPlannerService.getTransportation(state.currentRequest, {
      types: state.currentRequest.preferences?.transportationPreferences
    }),
    enabled: true,
    staleTime: 0,
    gcTime: 0,
  });

  // Update trip plan mutation
  const updateTripPlanMutation = useMutation({
    mutationFn: ({ planId, updates }: {
      planId: string;
      updates: {
        selectedActivities?: string[];
        selectedAccommodation?: string[];
        selectedTransportation?: string[];
      };
    }) => tripPlannerService.updateTripPlan(planId, updates),
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['trip-plan'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['accommodation'] });
      queryClient.invalidateQueries({ queryKey: ['transportation'] });
    },
  });

  // Regenerate plan mutation
  const regeneratePlanMutation = useMutation({
    mutationFn: ({ planId, preferences }: {
      planId: string;
      preferences?: {
        themes?: string[];
        budgetAdjustment?: number;
        focusAreas?: string[];
      };
    }) => tripPlannerService.regeneratePlan(planId, preferences),
    onSuccess: (data) => {
      queryClient.setQueryData(['trip-plan', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['trip-plan'] });
    },
  });

  // AI suggestions mutation
  const aiSuggestionsMutation = useMutation({
    mutationFn: ({ planId, input }: {
      planId: string;
      input: string;
    }) => tripPlannerService.getAISuggestions(planId, input),
  });

  // Update request function with cascading updates
  const updateRequest = useCallback((updates: Partial<TripPlanningRequest> | TripPlanningRequest) => {
    setState(prev => {
      const newRequest = 'preferences' in updates && 'startDate' in updates && 'endDate' in updates
        ? updates as TripPlanningRequest
        : { ...prev.currentRequest, ...updates };

      // Determine which steps need refreshing based on what changed
      const needsRefresh = {
        activities: false,
        accommodation: false,
        transportation: false
      };

      // Check if any major changes that affect all downstream steps
      const hasThemeChange = updates.preferences?.themes;
      const hasActivityTypeChange = updates.preferences?.activityTypes;
      const hasDestinationChange = updates.destination;
      const hasBudgetChange = updates.budget;
      const hasDurationChange = updates.duration;
      const hasDateChange = updates.startDate || updates.endDate;

      // If any major change, refresh everything downstream
      if (hasThemeChange || hasActivityTypeChange || hasDestinationChange || 
          hasBudgetChange || hasDurationChange || hasDateChange) {
        needsRefresh.activities = true;
        needsRefresh.accommodation = true;
        needsRefresh.transportation = true;
        
        // Clear all selections when major changes occur
        return {
          ...prev,
          currentRequest: newRequest,
          selectedActivities: [],
          selectedAccommodation: [],
          selectedTransportation: [],
          refreshingSteps: needsRefresh
        };
      }

      // Check if accommodation preferences changed
      if (updates.preferences?.accommodationTypes) {
        needsRefresh.accommodation = true;
        needsRefresh.transportation = true;
        
        // Clear accommodation and transportation selections
        return {
          ...prev,
          currentRequest: newRequest,
          selectedAccommodation: [],
          selectedTransportation: [],
          refreshingSteps: needsRefresh
        };
      }

      // Check if transportation preferences changed
      if (updates.preferences?.transportationPreferences) {
        needsRefresh.transportation = true;
        
        // Clear transportation selections
        return {
          ...prev,
          currentRequest: newRequest,
          selectedTransportation: [],
          refreshingSteps: needsRefresh
        };
      }

      return {
        ...prev,
        currentRequest: newRequest,
        refreshingSteps: needsRefresh
      };
    });

    // Clear refreshing states after a delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        refreshingSteps: {
          activities: false,
          accommodation: false,
          transportation: false
        }
      }));
    }, 2000);
  }, []);

  // Selection handlers with cascading updates
  const toggleActivity = useCallback((activityId: string) => {
    setState(prev => {
      const newSelection = prev.selectedActivities.includes(activityId)
        ? prev.selectedActivities.filter(id => id !== activityId)
        : [...prev.selectedActivities, activityId];

      // When activities change, clear and refresh accommodation and transportation
      return {
        ...prev,
        selectedActivities: newSelection,
        selectedAccommodation: [], // Clear accommodation selections
        selectedTransportation: [], // Clear transportation selections
        refreshingSteps: {
          activities: false,
          accommodation: true,
          transportation: true
        }
      };
    });

    // Clear refreshing states
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        refreshingSteps: {
          ...prev.refreshingSteps,
          accommodation: false,
          transportation: false
        }
      }));
    }, 1500);
  }, []);

  const toggleAccommodation = useCallback((accommodationId: string) => {
    setState(prev => {
      const newSelection = prev.selectedAccommodation.includes(accommodationId)
        ? prev.selectedAccommodation.filter(id => id !== accommodationId)
        : [...prev.selectedAccommodation, accommodationId];

      // When accommodation changes, clear and refresh transportation
      return {
        ...prev,
        selectedAccommodation: newSelection,
        selectedTransportation: [], // Clear transportation selections
        refreshingSteps: {
          ...prev.refreshingSteps,
          transportation: true
        }
      };
    });

    // Clear refreshing state
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        refreshingSteps: {
          ...prev.refreshingSteps,
          transportation: false
        }
      }));
    }, 1000);
  }, []);

  const toggleTransportation = useCallback((transportationId: string) => {
    setState(prev => {
      const newSelection = prev.selectedTransportation.includes(transportationId)
        ? prev.selectedTransportation.filter(id => id !== transportationId)
        : [...prev.selectedTransportation, transportationId];

      // Transportation is the final step, no downstream clearing needed
      return {
        ...prev,
        selectedTransportation: newSelection
      };
    });
  }, []);

  // Custom input handlers
  const updateCustomInput = useCallback((section: keyof typeof state.customInputs, value: string) => {
    setState(prev => ({
      ...prev,
      customInputs: {
        ...prev.customInputs,
        [section]: value
      }
    }));
  }, []);

  // Search and filter functions
  const searchActivities = useCallback((query: string) => {
    if (!activitiesQuery.data) return [];
    
    const searchTerm = query.toLowerCase();
    return activitiesQuery.data.filter(activity => 
      activity.name.toLowerCase().includes(searchTerm) ||
      activity.description.toLowerCase().includes(searchTerm) ||
      activity.type.toLowerCase().includes(searchTerm) ||
      activity.location.toLowerCase().includes(searchTerm)
    );
  }, [activitiesQuery.data]);

  const searchAccommodation = useCallback((query: string) => {
    if (!accommodationQuery.data) return [];
    
    const searchTerm = query.toLowerCase();
    return accommodationQuery.data.filter(acc => 
      acc.name.toLowerCase().includes(searchTerm) ||
      acc.description.toLowerCase().includes(searchTerm) ||
      acc.type.toLowerCase().includes(searchTerm) ||
      acc.location.toLowerCase().includes(searchTerm)
    );
  }, [accommodationQuery.data]);

  const searchTransportation = useCallback((query: string) => {
    if (!transportationQuery.data) return [];
    
    const searchTerm = query.toLowerCase();
    return transportationQuery.data.filter(transport => 
      transport.name.toLowerCase().includes(searchTerm) ||
      transport.description.toLowerCase().includes(searchTerm) ||
      transport.type.toLowerCase().includes(searchTerm) ||
      transport.from.toLowerCase().includes(searchTerm) ||
      transport.to.toLowerCase().includes(searchTerm)
    );
  }, [transportationQuery.data]);

  // Filter by price range
  const filterByPriceRange = useCallback((section: 'activities' | 'accommodation' | 'transportation', minPrice: number, maxPrice: number) => {
    switch (section) {
      case 'activities':
        return activitiesQuery.data?.filter(activity => 
          activity.price >= minPrice && activity.price <= maxPrice
        ) || [];
      case 'accommodation':
        return accommodationQuery.data?.filter(acc => {
          const totalPrice = acc.pricePerNight * acc.totalNights;
          return totalPrice >= minPrice && totalPrice <= maxPrice;
        }) || [];
      case 'transportation':
        return transportationQuery.data?.filter(transport => 
          transport.price >= minPrice && transport.price <= maxPrice
        ) || [];
      default:
        return [];
    }
  }, [activitiesQuery.data, accommodationQuery.data, transportationQuery.data]);

  // Filter by rating
  const filterByRating = useCallback((section: 'activities' | 'accommodation', minRating: number) => {
    switch (section) {
      case 'activities':
        return activitiesQuery.data?.filter(activity => activity.rating >= minRating) || [];
      case 'accommodation':
        return accommodationQuery.data?.filter(acc => acc.rating >= minRating) || [];
      default:
        return [];
    }
  }, [activitiesQuery.data, accommodationQuery.data]);

  // Get AI suggestions
  const getAISuggestions = useCallback(async (section: 'activities' | 'accommodation' | 'transportation', input: string) => {
    if (!tripPlanQuery.data?.id) return null;
    section.includes('activities');

    try {
      const result = await aiSuggestionsMutation.mutateAsync({
        planId: tripPlanQuery.data.id,
        input
      });
      return result;
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      return null;
    }
  }, [tripPlanQuery.data?.id, aiSuggestionsMutation]);

  // Calculate total cost
  const calculateTotalCost = useCallback(() => {
    const activities = activitiesQuery.data || [];
    const accommodation = accommodationQuery.data || [];
    const transportation = transportationQuery.data || [];

    const activityCost = activities
      .filter(activity => state.selectedActivities.includes(activity.id))
      .reduce((sum, activity) => sum + activity.price, 0);

    const accommodationCost = accommodation
      .filter(acc => state.selectedAccommodation.includes(acc.id))
      .reduce((sum, acc) => sum + (acc.pricePerNight * acc.totalNights), 0);

    const transportCost = transportation
      .filter(transport => state.selectedTransportation.includes(transport.id))
      .reduce((sum, transport) => sum + transport.price, 0);

    return activityCost + accommodationCost + transportCost;
  }, [activitiesQuery.data, accommodationQuery.data, transportationQuery.data, state.selectedActivities, state.selectedAccommodation, state.selectedTransportation]);

  // Get filtered data based on selections
  const getFilteredData = useCallback(() => {
    const activities = activitiesQuery.data || [];
    const accommodation = accommodationQuery.data || [];
    const transportation = transportationQuery.data || [];

    return {
      selectedActivities: activities.filter(activity => state.selectedActivities.includes(activity.id)),
      selectedAccommodation: accommodation.filter(acc => state.selectedAccommodation.includes(acc.id)),
      selectedTransportation: transportation.filter(transport => state.selectedTransportation.includes(transport.id))
    };
  }, [activitiesQuery.data, accommodationQuery.data, transportationQuery.data, state.selectedActivities, state.selectedAccommodation, state.selectedTransportation]);

  return {
    // State
    ...state,
    
    // Queries
    tripPlan: tripPlanQuery.data,
    activities: activitiesQuery.data || [],
    accommodation: accommodationQuery.data || [],
    transportation: transportationQuery.data || [],
    
    // Loading states
    isLoading: tripPlanQuery.isLoading,
    isActivitiesLoading: activitiesQuery.isLoading || state.refreshingSteps.activities,
    isAccommodationLoading: accommodationQuery.isLoading || state.refreshingSteps.accommodation,
    isTransportationLoading: transportationQuery.isLoading || state.refreshingSteps.transportation,
    
    // Error states
    error: tripPlanQuery.error || activitiesQuery.error || accommodationQuery.error || transportationQuery.error,
    
    // Mutations
    updateTripPlan: updateTripPlanMutation.mutate,
    regeneratePlan: regeneratePlanMutation.mutate,
    getAISuggestions,
    
    // Actions
    updateRequest,
    toggleActivity,
    toggleAccommodation,
    toggleTransportation,
    updateCustomInput,
    
    // Search and filter functions
    searchActivities,
    searchAccommodation,
    searchTransportation,
    filterByPriceRange,
    filterByRating,
    
    // Computed values
    calculateTotalCost,
    getFilteredData,
    
    // Query invalidation
    invalidateQueries: () => {
      queryClient.invalidateQueries({ queryKey: ['trip-plan'] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['accommodation'] });
      queryClient.invalidateQueries({ queryKey: ['transportation'] });
    }
  };
}
