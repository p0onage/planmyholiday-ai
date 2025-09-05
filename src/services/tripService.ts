// Trip-related API services

import { apiService } from './api';
import type { Trip, TripPlannerFormValues } from '../types';

export interface TripSearchParams {
  query?: string;
  location?: string;
  budget?: number;
  duration?: number;
  when?: string;
  adults?: number;
  kids?: number;
}

export interface TripSearchResponse {
  trips: Trip[];
  total: number;
  page: number;
  limit: number;
}

class TripService {
  // Search for trips based on criteria
  async searchTrips(params: TripSearchParams): Promise<TripSearchResponse> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiService.get<TripSearchResponse>(`/trips/search?${queryParams}`);
    return response.data;
  }

  // Get trip by ID
  async getTripById(id: number): Promise<Trip | null> {
    const response = await apiService.get<Trip>(`/trips/${id}`);
    return response.success ? response.data : null;
  }

  // Get featured trips
  async getFeaturedTrips(): Promise<Trip[]> {
    // Commented out JSON call - temporarily loading from local file
    // const response = await apiService.get<Trip[]>('/trips/featured');
    // return response.success ? response.data : [];
    
    // Load from local JSON file
    try {
      const response = await fetch('/data/featured-trips.json');
      if (!response.ok) {
        throw new Error('Failed to load featured trips');
      }
      const trips = await response.json();
      return trips;
    } catch (error) {
      console.error('Error loading featured trips:', error);
      return [];
    }
  }

  // Get trips by category
  async getTripsByCategory(category: string): Promise<Trip[]> {
    const response = await apiService.get<Trip[]>(`/trips/category/${category}`);
    return response.success ? response.data : [];
  }

  // Save trip to user's favorites
  async saveTrip(tripId: number): Promise<boolean> {
    const response = await apiService.post<{ success: boolean }>(`/trips/${tripId}/save`, {});
    return response.success && response.data.success;
  }

  // Remove trip from user's favorites
  async unsaveTrip(tripId: number): Promise<boolean> {
    const response = await apiService.delete<{ success: boolean }>(`/trips/${tripId}/save`);
    return response.success && response.data.success;
  }

  // Get user's saved trips
  async getSavedTrips(): Promise<Trip[]> {
    const response = await apiService.get<Trip[]>('/trips/saved');
    return response.success ? response.data : [];
  }

  // Convert form values to search params
  formValuesToSearchParams(formValues: TripPlannerFormValues): TripSearchParams {
    return {
      query: formValues.query || undefined,
      budget: formValues.budget || undefined,
      duration: formValues.durationValue || undefined,
      when: formValues.when === 'exact' 
        ? `${formValues.exactDates.start} to ${formValues.exactDates.end}`
        : formValues.when === 'month'
        ? `${formValues.year}-${formValues.month.toString().padStart(2, '0')}`
        : formValues.flexibleText || undefined,
      adults: formValues.adults || undefined,
      kids: formValues.kids || undefined,
    };
  }
}

export const tripService = new TripService();
export default tripService;
