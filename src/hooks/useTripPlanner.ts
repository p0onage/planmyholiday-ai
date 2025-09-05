import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripPlannerService } from '../services/tripPlannerService';
import type { 
  TripPlanningRequest
} from '../services/tripPlannerService';

// Hook for generating complete trip plan
export function useGenerateTripPlan(request: TripPlanningRequest) {
  return useQuery({
    queryKey: ['trip-plan', request],
    queryFn: () => tripPlannerService.generateTripPlan(request),
    enabled: true, // Run automatically when component mounts
    staleTime: 0, // No caching for real-time responses
    gcTime: 0, // No garbage collection time
  });
}

// Hook for getting activities
export function useActivities(request: TripPlanningRequest, filters?: {
  sortBy?: 'popularity' | 'rating' | 'price' | 'theme_match';
  activityTypes?: string[];
  budget?: number;
}) {
  return useQuery({
    queryKey: ['activities', request, filters],
    queryFn: () => tripPlannerService.getActivities(request, filters),
    enabled: false, // Only run when manually triggered
    staleTime: 0,
    gcTime: 0,
  });
}

// Hook for getting accommodation
export function useAccommodation(request: TripPlanningRequest, filters?: {
  sortBy?: 'price' | 'rating' | 'location' | 'theme_match';
  accommodationTypes?: string[];
  budget?: number;
}) {
  return useQuery({
    queryKey: ['accommodation', request, filters],
    queryFn: () => tripPlannerService.getAccommodation(request, filters),
    enabled: false, // Only run when manually triggered
    staleTime: 0,
    gcTime: 0,
  });
}

// Hook for getting transportation
export function useTransportation(request: TripPlanningRequest, filters?: {
  sortBy?: 'price' | 'duration' | 'convenience';
  types?: string[];
}) {
  return useQuery({
    queryKey: ['transportation', request, filters],
    queryFn: () => tripPlannerService.getTransportation(request, filters),
    enabled: false, // Only run when manually triggered
    staleTime: 0,
    gcTime: 0,
  });
}

// Hook for updating trip plan
export function useUpdateTripPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
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
}

// Hook for regenerating plan with AI
export function useRegeneratePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ planId, preferences }: {
      planId: string;
      preferences?: {
        themes?: string[];
        budgetAdjustment?: number;
        focusAreas?: string[];
      };
    }) => tripPlannerService.regeneratePlan(planId, preferences),
    onSuccess: (data) => {
      // Update the trip plan in cache
      queryClient.setQueryData(['trip-plan', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['trip-plan'] });
    },
  });
}

// Hook for getting AI suggestions
export function useAISuggestions(planId: string, input: string) {
  return useQuery({
    queryKey: ['ai-suggestions', planId, input],
    queryFn: () => tripPlannerService.getAISuggestions(planId, input),
    enabled: false, // Only run when manually triggered
    staleTime: 0,
    gcTime: 0,
  });
}

// Combined hook for managing trip planning state
export function useTripPlanningState(initialRequest: TripPlanningRequest) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);
  const [selectedTransportation, setSelectedTransportation] = useState<string[]>([]);
  const [customInputs, setCustomInputs] = useState<{
    activities: string;
    accommodation: string;
    transportation: string;
  }>({
    activities: '',
    accommodation: '',
    transportation: '',
  });

  const generateTripPlan = useGenerateTripPlan(initialRequest);
  const activities = useActivities(initialRequest);
  const accommodation = useAccommodation(initialRequest);
  const transportation = useTransportation(initialRequest);
  const updateTripPlan = useUpdateTripPlan();
  const regeneratePlan = useRegeneratePlan();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(4, step)));

  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => 
      prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId]
    );
  };

  const toggleAccommodation = (accommodationId: string) => {
    setSelectedAccommodation(prev => 
      prev.includes(accommodationId) 
        ? prev.filter(id => id !== accommodationId)
        : [...prev, accommodationId]
    );
  };

  const toggleTransportation = (transportationId: string) => {
    setSelectedTransportation(prev => 
      prev.includes(transportationId) 
        ? prev.filter(id => id !== transportationId)
        : [...prev, transportationId]
    );
  };

  const updateCustomInput = (section: keyof typeof customInputs, value: string) => {
    setCustomInputs(prev => ({ ...prev, [section]: value }));
  };

  return {
    // State
    currentStep,
    selectedActivities,
    selectedAccommodation,
    selectedTransportation,
    customInputs,
    
    // Queries
    generateTripPlan,
    activities,
    accommodation,
    transportation,
    
    // Mutations
    updateTripPlan,
    regeneratePlan,
    
    // Actions
    nextStep,
    prevStep,
    goToStep,
    toggleActivity,
    toggleAccommodation,
    toggleTransportation,
    updateCustomInput,
  };
}

// Import useState for the combined hook
import { useState } from 'react';
