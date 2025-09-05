// Trip Planner Service - AI-powered holiday planning
import { apiService } from './api';

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
    const response = await apiService.post<Activity[]>('/trip-planner/activities', {
      ...request,
      filters
    });
    return response.data;
  }

  // Get accommodation options
  async getAccommodation(request: TripPlanningRequest, filters?: {
    sortBy?: 'price' | 'rating' | 'location' | 'theme_match';
    accommodationTypes?: string[];
    budget?: number;
  }): Promise<Accommodation[]> {
    const response = await apiService.post<Accommodation[]>('/trip-planner/accommodation', {
      ...request,
      filters
    });
    return response.data;
  }

  // Get transportation options
  async getTransportation(request: TripPlanningRequest, filters?: {
    sortBy?: 'price' | 'duration' | 'convenience';
    types?: string[];
  }): Promise<Transportation[]> {
    const response = await apiService.post<Transportation[]>('/trip-planner/transportation', {
      ...request,
      filters
    });
    return response.data;
  }

  // Generate complete trip plan
  async generateTripPlan(request: TripPlanningRequest): Promise<TripPlan> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock data for demonstration
    const mockTripPlan: TripPlan = {
      id: 'mock-plan-' + Date.now(),
      destination: request.destination,
      startDate: request.startDate,
      endDate: request.endDate,
      totalBudget: request.budget,
      activities: [
        {
          id: '1',
          name: 'Beach Club',
          description: 'Relax at a luxury beach club',
          type: 'beach',
          rating: 4.8,
          price: 45,
          duration: '4 hours',
          date: 'Dec 16',
          image: '',
          location: 'Seminyak',
          isSelected: false,
          theme: 'tropical'
        },
        {
          id: '2',
          name: 'Temple Tour',
          description: 'Visit ancient temples',
          type: 'culture',
          rating: 4.6,
          price: 25,
          duration: '3 hours',
          date: 'Dec 17',
          image: '',
          location: 'Ubud',
          isSelected: false,
          theme: 'cultural'
        },
        {
          id: '3',
          name: 'Volcano Hike',
          description: 'Hike an active volcano',
          type: 'adventure',
          rating: 4.9,
          price: 65,
          duration: '8 hours',
          date: 'Dec 18',
          image: '',
          location: 'Mount Batur',
          isSelected: false,
          theme: 'adventure'
        }
      ],
      accommodation: [
        {
          id: '1',
          name: 'Luxury Resort',
          description: '5-star beachfront resort',
          type: 'resort',
          rating: 5.0,
          pricePerNight: 180,
          location: 'Seminyak',
          distanceToBeach: '2km to beach',
          image: '',
          isSelected: false,
          theme: 'luxury',
          totalNights: request.duration
        },
        {
          id: '2',
          name: 'Beach Villa',
          description: 'Private villa with pool',
          type: 'villa',
          rating: 4.7,
          pricePerNight: 120,
          location: 'Canggu',
          distanceToBeach: 'Beachfront',
          image: '',
          isSelected: false,
          theme: 'tropical',
          totalNights: request.duration
        }
      ],
      transportation: [
        {
          id: '1',
          type: 'flight',
          name: 'KLM Direct',
          description: 'Direct flight to Bali',
          duration: '15h 30m',
          price: 850,
          from: request.departureCity,
          to: `${request.destination} (DPS)`,
          isSelected: false,
          details: {
            airline: 'KLM',
            stops: 0,
            class: 'Economy'
          }
        },
        {
          id: '2',
          type: 'flight',
          name: 'Emirates +1',
          description: 'Flight with one stop',
          duration: '18h 45m',
          price: 720,
          from: request.departureCity,
          to: `${request.destination} (DPS)`,
          isSelected: false,
          details: {
            airline: 'Emirates',
            stops: 1,
            class: 'Economy'
          }
        },
        {
          id: '3',
          type: 'local_transport',
          name: 'Scooter Rental',
          description: 'Daily scooter rental',
          duration: '24 hours',
          price: 15,
          from: 'Hotel',
          to: 'Various',
          isSelected: false
        },
        {
          id: '4',
          type: 'local_transport',
          name: 'Airport Transfer',
          description: 'Private airport transfer',
          duration: '1 hour',
          price: 25,
          from: 'Airport',
          to: 'Hotel',
          isSelected: false
        }
      ],
      itinerary: [
        {
          date: request.startDate,
          activities: [],
          notes: 'Arrive → Check-in → Welcome dinner'
        },
        {
          date: '2025-12-16',
          activities: [],
          notes: 'Beach Club → Sunset viewing'
        },
        {
          date: '2025-12-17',
          activities: [],
          notes: 'Temple Tour → Spa treatment'
        },
        {
          date: '2025-12-18',
          activities: [],
          notes: 'Volcano Hike → Free day → Cultural show'
        }
      ],
      summary: {
        totalCost: 0,
        withinBudget: true,
        theme: 'tropical'
      }
    };

    return mockTripPlan;
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
