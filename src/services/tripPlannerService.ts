// Trip Planner Service - AI-powered holiday planning
import { apiService } from './api';
import { jsonDataService } from './jsonDataService';

// Types for trip planning
export interface TripPlanningRequest {
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  duration: number;
  adults: number;
  children: number;
  budget: number;
  preferences?: {
    themes?: string[];
    activityTypes?: string[];
    accommodationTypes?: string[];
    transportationPreferences?: string[];
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  type: string;
  rating: number;
  price: number;
  duration: string;
  date: string;
  image: string;
  location: string;
  isSelected: boolean;
  theme: string;
}

export interface Accommodation {
  id: string;
  name: string;
  description: string;
  type: string;
  rating: number;
  pricePerNight: number;
  location: string;
  distanceToBeach: string;
  image: string;
  isSelected: boolean;
  theme: string;
  totalNights: number;
}

export interface Transportation {
  id: string;
  type: 'flight' | 'local_transport';
  name: string;
  description: string;
  duration: string;
  price: number;
  from: string;
  to: string;
  isSelected: boolean;
  details?: {
    airline?: string;
    stops?: number;
    class?: string;
  };
}

export interface JourneySegment {
  id: string;
  title: string;
  route: string;
  description: string;
  image: string;
  transportTypes: string[];
}

export interface TransportOption {
  id: string;
  name: string;
  type: string;
  price: number;
  duration: string;
  image: string;
  description: string;
  details?: {
    airline?: string;
    company?: string;
    vehicle?: string;
    stops?: number;
    class?: string;
    vessel?: string;
  };
}

export interface ItineraryItem {
  date: string;
  activities: Activity[];
  accommodation?: Accommodation;
  transportation?: Transportation[];
  notes?: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  activities: Activity[];
  accommodation: Accommodation[];
  transportation: Transportation[];
  itinerary: ItineraryItem[];
  summary: {
    totalCost: number;
    withinBudget: boolean;
    theme: string;
  };
}

export interface TripPlanningResponse {
  success: boolean;
  data?: TripPlan;
  error?: string;
}

class TripPlannerService {
  // Get activities based on destination and filters
  async getActivities(request: TripPlanningRequest, filters?: {
    sortBy?: 'popularity' | 'rating' | 'price' | 'theme_match';
    activityTypes?: string[];
    budget?: number;
  }): Promise<Activity[]> {
    // For now, use JSON data service instead of API
    const activities = jsonDataService.generateActivities(request);
    
    // Apply filters
    let filteredActivities = activities;
    
    if (filters?.activityTypes && filters.activityTypes.length > 0) {
      filteredActivities = activities.filter(activity => 
        filters.activityTypes!.includes(activity.type)
      );
    }
    
    if (filters?.budget) {
      filteredActivities = activities.filter(activity => 
        activity.price <= filters.budget!
      );
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      filteredActivities.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.price - b.price;
          case 'popularity':
          case 'theme_match':
          default:
            return 0; // Keep original order
        }
      });
    }
    
    return filteredActivities;
  }

  // Get accommodation options
  async getAccommodation(request: TripPlanningRequest, filters?: {
    sortBy?: 'price' | 'rating' | 'location' | 'theme_match';
    accommodationTypes?: string[];
    budget?: number;
  }): Promise<Accommodation[]> {
    // For now, use JSON data service instead of API
    const accommodation = jsonDataService.generateAccommodation(request);
    
    // Apply filters
    let filteredAccommodation = accommodation;
    
    if (filters?.accommodationTypes && filters.accommodationTypes.length > 0) {
      filteredAccommodation = accommodation.filter(acc => 
        filters.accommodationTypes!.includes(acc.type)
      );
    }
    
    if (filters?.budget) {
      filteredAccommodation = accommodation.filter(acc => 
        (acc.pricePerNight * acc.totalNights) <= filters.budget!
      );
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      filteredAccommodation.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return a.pricePerNight - b.pricePerNight;
          case 'location':
          case 'theme_match':
          default:
            return 0; // Keep original order
        }
      });
    }
    
    return filteredAccommodation;
  }

  // Get transportation options
  async getTransportation(request: TripPlanningRequest, filters?: {
    sortBy?: 'price' | 'duration' | 'convenience';
    types?: string[];
  }): Promise<Transportation[]> {
    // For now, use JSON data service instead of API
    const transportation = jsonDataService.generateTransportation(request);
    
    // Apply filters
    let filteredTransportation = transportation;
    
    if (filters?.types && filters.types.length > 0) {
      filteredTransportation = transportation.filter(transport => 
        filters.types!.includes(transport.type)
      );
    }
    
    // Apply sorting
    if (filters?.sortBy) {
      filteredTransportation.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'duration':
            // Parse duration strings (e.g., "12h 30m" -> 12.5)
            const parseDuration = (duration: string) => {
              const match = duration.match(/(\d+)h\s*(\d+)?m?/);
              if (match) {
                const hours = parseInt(match[1]);
                const minutes = match[2] ? parseInt(match[2]) : 0;
                return hours + (minutes / 60);
              }
              return 0;
            };
            return parseDuration(a.duration) - parseDuration(b.duration);
          case 'convenience':
          default:
            return 0; // Keep original order
        }
      });
    }
    
    return filteredTransportation;
  }

  // Get journey segments for transportation planning
  async getJourneySegments(request: TripPlanningRequest): Promise<JourneySegment[]> {
    // For now, use JSON data service instead of API
    return jsonDataService.getJourneySegments(request);
  }

  // Get transport options for a specific journey segment
  async getTransportOptionsForSegment(
    request: TripPlanningRequest, 
    segmentId: string
  ): Promise<TransportOption[]> {
    // For now, use JSON data service instead of API
    return jsonDataService.getTransportOptionsForSegment(request, segmentId);
  }

  // Generate complete trip plan
  async generateTripPlan(request: TripPlanningRequest): Promise<TripPlan> {
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use JSON data service to generate trip plan
    return jsonDataService.generateTripPlan(request);
  }

  // Update trip plan with selections
  async updateTripPlan(planId: string, updates: {
    selectedActivities?: string[];
    selectedAccommodation?: string[];
    selectedTransportation?: string[];
  }): Promise<TripPlan> {
    const response = await apiService.put<TripPlan>(`/trip-planner/${planId}`, updates);
    return response.data;
  }

  // Regenerate plan with AI
  async regeneratePlan(planId: string, preferences?: {
    themes?: string[];
    budgetAdjustment?: number;
    focusAreas?: string[];
  }): Promise<TripPlan> {
    const response = await apiService.post<TripPlan>(`/trip-planner/${planId}/regenerate`, preferences);
    return response.data;
  }

  // Get AI suggestions for customization
  async getAISuggestions(planId: string, input: string): Promise<{
    activities?: Activity[];
    accommodation?: Accommodation[];
    transportation?: Transportation[];
  }> {
    const response = await apiService.post(`/trip-planner/${planId}/suggestions`, { input });
    return response.data as {
      activities?: Activity[];
      accommodation?: Accommodation[];
      transportation?: Transportation[];
    };
  }
}

export const tripPlannerService = new TripPlannerService();
export default tripPlannerService;
