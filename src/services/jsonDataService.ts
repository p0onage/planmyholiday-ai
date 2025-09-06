// JSON Data Service - Loads data from JSON files for development
import featuredTripsData from '../../public/data/featured-trips.json';
import tripPlanningData from '../../public/data/trip-planning-data.json';
import type { 
  TripPlanningRequest, 
  Activity, 
  Accommodation, 
  Transportation, 
  TripPlan,
  ItineraryItem,
  JourneySegment,
  TransportOption 
} from './tripPlannerService';

// Transform featured trips data to match our internal structure
export interface FeaturedTrip {
  id: number;
  name: string;
  location: string;
  image: string;
  types: string[];
  rating: string;
  activities: string[];
  budget: string;
  itinerary: string[];
}

class JsonDataService {
  private featuredTrips: FeaturedTrip[] = featuredTripsData as FeaturedTrip[];
  private tripData = tripPlanningData;

  // Get all featured trips
  getFeaturedTrips(): FeaturedTrip[] {
    return this.featuredTrips;
  }

  // Get trip by ID
  getTripById(id: number): FeaturedTrip | undefined {
    return this.featuredTrips.find(trip => trip.id === id);
  }

  // Search trips by destination
  searchTripsByDestination(destination: string): FeaturedTrip[] {
    return this.featuredTrips.filter(trip => 
      trip.location.toLowerCase().includes(destination.toLowerCase()) ||
      trip.name.toLowerCase().includes(destination.toLowerCase())
    );
  }

  // Filter trips by budget range
  filterTripsByBudget(budget: number): FeaturedTrip[] {
    return this.featuredTrips.filter(trip => {
      const budgetRange = this.parseBudgetRange(trip.budget);
      return budget >= budgetRange.min && budget <= budgetRange.max;
    });
  }

  // Filter trips by activity types
  filterTripsByActivities(activityTypes: string[]): FeaturedTrip[] {
    return this.featuredTrips.filter(trip => 
      activityTypes.some(type => 
        trip.activities.some(activity => 
          activity.toLowerCase().includes(type.toLowerCase())
        )
      )
    );
  }

  // Get destination data
  getDestinationData(destination: string) {
    const normalizedDestination = destination.toLowerCase().replace(/\s+/g, '');
    return this.tripData.destinations[normalizedDestination as keyof typeof this.tripData.destinations];
  }

  // Get first theme for a destination
  getFirstThemeForDestination(destination: string): string {
    const destinationData = this.getDestinationData(destination);
    return destinationData?.popularThemes?.[0] || 'general';
  }

  // Get all available themes for a destination
  getAvailableThemesForDestination(destination: string): string[] {
    const destinationData = this.getDestinationData(destination);
    return destinationData?.popularThemes || ['general'];
  }

  // Get activities for destination
  getDestinationActivities(destination: string) {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    return this.tripData.activities[normalizedDestination as keyof typeof this.tripData.activities] || [];
  }

  // Get accommodation for destination
  getDestinationAccommodation(destination: string) {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    return this.tripData.accommodation[normalizedDestination as keyof typeof this.tripData.accommodation] || [];
  }

  // Get transportation for destination
  getDestinationTransportation(destination: string) {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    return this.tripData.transportation[normalizedDestination as keyof typeof this.tripData.transportation] || [];
  }

  // Get journey segments for destination
  getDestinationJourneySegments(destination: string) {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    return this.tripData.journeySegments[normalizedDestination as keyof typeof this.tripData.journeySegments] || [];
  }

  // Get itinerary template for destination
  getDestinationItinerary(destination: string) {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    return this.tripData.itineraryTemplates[normalizedDestination as keyof typeof this.tripData.itineraryTemplates] || [];
  }

  // Generate activities based on destination data
  generateActivities(request: TripPlanningRequest, tripData?: FeaturedTrip): Activity[] {
    // Get activities from the comprehensive JSON data
    const destinationActivities = this.getDestinationActivities(request.destination);
    
    if (destinationActivities.length > 0) {
      return destinationActivities.map((activity) => ({
        id: activity.id,
        name: activity.name,
        description: activity.description,
        type: activity.type,
        rating: activity.rating,
        price: this.adjustPriceForBudget(activity.price, request.budget),
        duration: activity.duration,
        date: request.startDate,
        image: activity.image,
        location: activity.location,
        isSelected: false,
        theme: activity.themes[0] || 'general'
      }));
    }

    // Fallback to featured trip data if no destination-specific activities
    if (tripData) {
      return tripData.activities.map((activityName, index) => ({
        id: `trip-${tripData.id}-${index + 1}`,
        name: activityName,
        description: `Experience ${activityName.toLowerCase()} in ${tripData.location}`,
        type: this.mapActivityType(activityName),
        rating: parseFloat(tripData.rating),
        price: this.calculateActivityPrice(activityName, request.budget),
        duration: this.getActivityDuration(activityName),
        date: request.startDate,
        image: `https://picsum.photos/400/300?random=${tripData.id}-${index}`,
        location: tripData.location,
        isSelected: false,
        theme: tripData.types[0]?.toLowerCase() || 'general'
      }));
    }

    // Final fallback to default activities
    return [
      {
        id: 'default-1',
        name: 'Beach Club',
        description: 'Relax at a luxury beach club with stunning ocean views',
        type: 'beach',
        rating: 4.8,
        price: 45,
        duration: '4 hours',
        date: request.startDate,
        image: 'https://picsum.photos/400/300?random=beach',
        location: 'Coastal Area',
        isSelected: false,
        theme: 'tropical'
      },
      {
        id: 'default-2',
        name: 'Cultural Tour',
        description: 'Explore local culture and historical sites',
        type: 'culture',
        rating: 4.6,
        price: 25,
        duration: '3 hours',
        date: request.startDate,
        image: 'https://picsum.photos/400/300?random=culture',
        location: 'City Center',
        isSelected: false,
        theme: 'cultural'
      },
      {
        id: 'default-3',
        name: 'Adventure Activity',
        description: 'Exciting outdoor adventure experience',
        type: 'adventure',
        rating: 4.9,
        price: 65,
        duration: '8 hours',
        date: request.startDate,
        image: 'https://picsum.photos/400/300?random=adventure',
        location: 'Mountain Area',
        isSelected: false,
        theme: 'adventure'
      }
    ];
  }

  // Generate accommodation based on destination data
  generateAccommodation(request: TripPlanningRequest, tripData?: FeaturedTrip): Accommodation[] {
    // Get accommodation from the comprehensive JSON data
    const destinationAccommodation = this.getDestinationAccommodation(request.destination);
    
    if (destinationAccommodation.length > 0) {
      return destinationAccommodation.map((acc) => ({
        id: acc.id,
        name: acc.name,
        description: acc.description,
        type: acc.type,
        rating: acc.rating,
        pricePerNight: this.adjustPriceForBudget(acc.pricePerNight, request.budget),
        location: acc.location,
        distanceToBeach: acc.distanceToBeach,
        image: acc.image,
        isSelected: false,
        theme: acc.themes[0] || 'general',
        totalNights: request.duration
      }));
    }

    // Fallback to featured trip data if no destination-specific accommodation
    if (tripData) {
      const budgetRange = this.parseBudgetRange(tripData.budget);
      const avgPricePerNight = budgetRange.max / request.duration;
      
      return [
        {
          id: `trip-${tripData.id}-acc-1`,
          name: `${tripData.name} Resort`,
          description: `Premium accommodation in ${tripData.location}`,
          type: 'resort',
          rating: parseFloat(tripData.rating),
          pricePerNight: Math.round(avgPricePerNight * 0.6),
          location: tripData.location,
          distanceToBeach: 'Beachfront',
          image: tripData.image,
          isSelected: false,
          theme: tripData.types[0]?.toLowerCase() || 'luxury',
          totalNights: request.duration
        },
        {
          id: `trip-${tripData.id}-acc-2`,
          name: `${tripData.name} Hotel`,
          description: `Comfortable hotel in ${tripData.location}`,
          type: 'hotel',
          rating: parseFloat(tripData.rating) - 0.5,
          pricePerNight: Math.round(avgPricePerNight * 0.4),
          location: tripData.location,
          distanceToBeach: '2km to beach',
          image: `https://picsum.photos/400/300?random=${tripData.id}-hotel`,
          isSelected: false,
          theme: tripData.types[0]?.toLowerCase() || 'comfort',
          totalNights: request.duration
        }
      ];
    }

    // Final fallback to default accommodation
    return [
      {
        id: 'default-1',
        name: 'Luxury Resort',
        description: '5-star beachfront resort with all amenities',
        type: 'resort',
        rating: 5.0,
        pricePerNight: 180,
        location: 'Beachfront',
        distanceToBeach: 'Beachfront',
        image: 'https://picsum.photos/400/300?random=resort',
        isSelected: false,
        theme: 'luxury',
        totalNights: request.duration
      },
      {
        id: 'default-2',
        name: 'Boutique Hotel',
        description: 'Charming boutique hotel in city center',
        type: 'hotel',
        rating: 4.7,
        pricePerNight: 120,
        location: 'City Center',
        distanceToBeach: '5km to beach',
        image: 'https://picsum.photos/400/300?random=boutique',
        isSelected: false,
        theme: 'boutique',
        totalNights: request.duration
      }
    ];
  }

  // Generate transportation options based on destination data
  generateTransportation(request: TripPlanningRequest): Transportation[] {
    // Get transportation from the comprehensive JSON data
    const destinationTransportation = this.getDestinationTransportation(request.destination);
    
    if (destinationTransportation.length > 0) {
      return destinationTransportation.map((transport) => ({
        id: transport.id,
        type: transport.type as "flight" | "local_transport",
        name: transport.name,
        description: transport.description,
        duration: transport.duration,
        price: this.adjustPriceForBudget(transport.price, request.budget),
        from: transport.from,
        to: transport.to,
        isSelected: false,
        details: transport.details
      }));
    }

    // Fallback to default transportation
    return [
      {
        id: 'default-1',
        type: 'flight',
        name: 'Direct Flight',
        description: `Direct flight from ${request.departureCity} to ${request.destination}`,
        duration: '12h 30m',
        price: 850,
        from: request.departureCity,
        to: `${request.destination} (Airport)`,
        isSelected: false,
        details: {
          airline: 'Major Airline',
          stops: 0,
          class: 'Economy'
        }
      },
      {
        id: 'default-2',
        type: 'flight',
        name: 'Connecting Flight',
        description: `Flight with one stop to ${request.destination}`,
        duration: '16h 45m',
        price: 720,
        from: request.departureCity,
        to: `${request.destination} (Airport)`,
        isSelected: false,
        details: {
          airline: 'Budget Airline',
          stops: 1,
          class: 'Economy'
        }
      },
      {
        id: 'default-3',
        type: 'local_transport',
        name: 'Car Rental',
        description: 'Daily car rental for local transportation',
        duration: '24 hours',
        price: 35,
        from: 'Airport',
        to: 'Various',
        isSelected: false
      },
      {
        id: 'default-4',
        type: 'local_transport',
        name: 'Airport Transfer',
        description: 'Private airport transfer service',
        duration: '1 hour',
        price: 25,
        from: 'Airport',
        to: 'Hotel',
        isSelected: false
      }
    ];
  }

  // Get journey segments for transportation planning
  getJourneySegments(request: TripPlanningRequest): JourneySegment[] {
    // Get journey segments from the comprehensive JSON data
    const destinationSegments = this.getDestinationJourneySegments(request.destination);
    
    if (destinationSegments.length > 0) {
      return destinationSegments.map((segment) => ({
        id: segment.id,
        title: segment.title,
        route: segment.route.replace('Amsterdam', request.departureCity).replace('Bali', request.destination).replace('Tokyo', request.destination).replace('Santorini', request.destination),
        description: segment.description,
        image: segment.image,
        transportTypes: segment.transportTypes
      }));
    }

    // Fallback to default journey segments
    return [
      {
        id: 'outbound',
        title: 'Outbound Journey',
        route: `${request.departureCity} → ${request.destination}`,
        description: 'International travel to your destination',
        image: 'https://picsum.photos/400/300?random=outbound-flight',
        transportTypes: ['flight', 'boat', 'train', 'drive', 'bus']
      },
      {
        id: 'local',
        title: 'Local Transport',
        route: `Within ${request.destination}`,
        description: 'Getting around during your stay',
        image: 'https://picsum.photos/400/300?random=local-transport',
        transportTypes: ['local_transport', 'rental']
      },
      {
        id: 'intercity',
        title: 'Inter-city Travel',
        route: 'Various locations',
        description: 'Travel between different areas',
        image: 'https://picsum.photos/400/300?random=intercity-travel',
        transportTypes: ['local_transport', 'rental', 'bus']
      },
      {
        id: 'return',
        title: 'Return Journey',
        route: `${request.destination} → ${request.departureCity}`,
        description: 'International travel back home',
        image: 'https://picsum.photos/400/300?random=return-flight',
        transportTypes: ['flight', 'boat', 'train', 'drive', 'bus']
      }
    ];
  }

  // Get transport options for a specific journey segment
  getTransportOptionsForSegment(request: TripPlanningRequest, segmentId: string): TransportOption[] {
    // Handle full destination names like "Bali, Indonesia"
    const normalizedDestination = request.destination.toLowerCase()
      .replace(/\s*,\s*\w+$/, '') // Remove country name
      .replace(/\s+/g, '');
    
    const destinationTransportOptions = this.tripData.transportOptions[normalizedDestination as keyof typeof this.tripData.transportOptions];
    
    if (destinationTransportOptions && destinationTransportOptions[segmentId as keyof typeof destinationTransportOptions]) {
      const segmentOptions = destinationTransportOptions[segmentId as keyof typeof destinationTransportOptions] as any[];
      return segmentOptions.map((option) => ({
        id: option.id,
        name: option.name,
        type: option.type,
        price: this.adjustPriceForBudget(option.price, request.budget),
        duration: option.duration,
        image: option.image,
        description: option.description,
        details: option.details
      }));
    }

    // Fallback to default transport options
    return this.getDefaultTransportOptionsForSegment(segmentId, request);
  }

  // Get default transport options for a segment (fallback)
  private getDefaultTransportOptionsForSegment(segmentId: string, request: TripPlanningRequest): TransportOption[] {
    const defaultOptions: { [key: string]: TransportOption[] } = {
      outbound: [
        {
          id: 'default-outbound-1',
          name: 'Direct Flight',
          type: 'flight',
          price: 450,
          duration: '12h 30m',
          image: 'https://picsum.photos/400/300?random=default-flight',
          description: `Direct flight from ${request.departureCity} to ${request.destination}`,
          details: {
            airline: 'Major Airline',
            stops: 0,
            class: 'Economy'
          }
        }
      ],
      local: [
        {
          id: 'default-local-1',
          name: 'Local Transport',
          type: 'local_transport',
          price: 25,
          duration: 'Daily',
          image: 'https://picsum.photos/400/300?random=default-local',
          description: 'Local transportation options',
          details: {
            company: 'Local Service'
          }
        }
      ],
      intercity: [
        {
          id: 'default-intercity-1',
          name: 'Inter-city Transport',
          type: 'local_transport',
          price: 35,
          duration: '2-3 hours',
          image: 'https://picsum.photos/400/300?random=default-intercity',
          description: 'Transport between different areas',
          details: {
            company: 'Local Service'
          }
        }
      ],
      return: [
        {
          id: 'default-return-1',
          name: 'Return Flight',
          type: 'flight',
          price: 450,
          duration: '12h 30m',
          image: 'https://picsum.photos/400/300?random=default-return',
          description: `Return flight from ${request.destination} to ${request.departureCity}`,
          details: {
            airline: 'Major Airline',
            stops: 0,
            class: 'Economy'
          }
        }
      ]
    };

    return defaultOptions[segmentId] || [];
  }

  // Generate itinerary based on destination data
  generateItinerary(request: TripPlanningRequest, tripData?: FeaturedTrip): ItineraryItem[] {
    const itinerary: ItineraryItem[] = [];
    const startDate = new Date(request.startDate);
    
    // Get itinerary template from destination data
    const destinationItinerary = this.getDestinationItinerary(request.destination);
    
    for (let i = 0; i < request.duration; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      let notes = '';
      let title = '';
      
      if (destinationItinerary[i]) {
        title = destinationItinerary[i].title;
        notes = destinationItinerary[i].notes;
      } else if (tripData && tripData.itinerary[i]) {
        notes = tripData.itinerary[i];
      } else {
        if (i === 0) {
          title = 'Arrival Day';
          notes = 'Arrival → Check-in → Welcome dinner';
        } else if (i === request.duration - 1) {
          title = 'Departure Day';
          notes = 'Final day → Check-out → Departure';
        } else {
          title = `Day ${i + 1}`;
          notes = `Day ${i + 1} activities and exploration`;
        }
      }

      itinerary.push({
        date: currentDate.toISOString().split('T')[0],
        activities: [],
        notes: title ? `${title}: ${notes}` : notes
      });
    }

    return itinerary;
  }

  // Adjust price based on budget
  private adjustPriceForBudget(basePrice: number, budget: number): number {
    const budgetMultiplier = Math.min(budget / 2000, 2); // Scale with budget, max 2x
    return Math.round(basePrice * budgetMultiplier);
  }

  // Generate complete trip plan
  generateTripPlan(request: TripPlanningRequest): TripPlan {
    // Find matching featured trip
    const matchingTrip = this.searchTripsByDestination(request.destination)[0];
    
    const activities = this.generateActivities(request, matchingTrip);
    const accommodation = this.generateAccommodation(request, matchingTrip);
    const transportation = this.generateTransportation(request);
    const itinerary = this.generateItinerary(request, matchingTrip);

    const totalCost = activities.reduce((sum, activity) => sum + activity.price, 0) +
                     accommodation.reduce((sum, acc) => sum + (acc.pricePerNight * acc.totalNights), 0) +
                     transportation.reduce((sum, transport) => sum + transport.price, 0);

    return {
      id: `plan-${Date.now()}`,
      destination: request.destination,
      startDate: request.startDate,
      endDate: request.endDate,
      totalBudget: request.budget,
      activities,
      accommodation,
      transportation,
      itinerary,
      summary: {
        totalCost,
        withinBudget: totalCost <= request.budget,
        theme: matchingTrip?.types[0]?.toLowerCase() || 'general'
      }
    };
  }

  // Helper methods
  private parseBudgetRange(budgetString: string): { min: number; max: number } {
    const budgetMap: { [key: string]: { min: number; max: number } } = {
      'Budget ($)': { min: 500, max: 1500 },
      'Mid-range ($$)': { min: 1500, max: 4000 },
      'High-end ($$$)': { min: 4000, max: 8000 },
      'Luxury ($$$$)': { min: 8000, max: 20000 }
    };
    
    return budgetMap[budgetString] || { min: 1000, max: 5000 };
  }

  private mapActivityType(activityName: string): string {
    const activityMap: { [key: string]: string } = {
      'Surfing': 'watersports',
      'Snorkeling': 'watersports',
      'Yoga': 'wellness',
      'Temple Visits': 'culture',
      'Shopping': 'leisure',
      'Sushi Making': 'culture',
      'Cherry Blossom Viewing': 'nature',
      'Sunset Viewing': 'leisure',
      'Wine Tasting': 'culture',
      'Beach Hopping': 'beach',
      'Photography': 'leisure',
      'Wildlife Spotting': 'nature',
      'Zip-lining': 'adventure',
      'Volcano Hiking': 'adventure',
      'Coffee Tour': 'culture',
      'Northern Lights': 'nature',
      'Glacier Hiking': 'adventure',
      'Blue Lagoon': 'wellness',
      'Geyser Watching': 'nature',
      'Camel Trekking': 'adventure',
      'Desert Camping': 'adventure',
      'Souk Shopping': 'leisure',
      'Atlas Mountains': 'nature',
      'Hiking': 'adventure',
      'Bungee Jumping': 'adventure',
      'Milford Sound': 'nature',
      'Burj Khalifa': 'leisure',
      'Desert Safari': 'adventure',
      'Luxury Dining': 'culture',
      'Palm Jumeirah': 'leisure',
      'Gold Souk': 'culture'
    };

    return activityMap[activityName] || 'general';
  }

  private calculateActivityPrice(activityName: string, totalBudget: number): number {
    const basePrices: { [key: string]: number } = {
      'Surfing': 45,
      'Snorkeling': 35,
      'Yoga': 25,
      'Temple Visits': 15,
      'Shopping': 0,
      'Sushi Making': 60,
      'Cherry Blossom Viewing': 20,
      'Sunset Viewing': 30,
      'Wine Tasting': 50,
      'Beach Hopping': 25,
      'Photography': 40,
      'Wildlife Spotting': 55,
      'Zip-lining': 80,
      'Volcano Hiking': 70,
      'Coffee Tour': 35,
      'Northern Lights': 100,
      'Glacier Hiking': 120,
      'Blue Lagoon': 90,
      'Geyser Watching': 60,
      'Camel Trekking': 75,
      'Desert Camping': 100,
      'Souk Shopping': 0,
      'Atlas Mountains': 80,
      'Hiking': 40,
      'Bungee Jumping': 150,
      'Milford Sound': 85,
      'Burj Khalifa': 50,
      'Desert Safari': 90,
      'Luxury Dining': 120,
      'Palm Jumeirah': 60,
      'Gold Souk': 0
    };

    const basePrice = basePrices[activityName] || 30;
    const budgetMultiplier = Math.min(totalBudget / 2000, 2); // Scale with budget
    return Math.round(basePrice * budgetMultiplier);
  }

  private getActivityDuration(activityName: string): string {
    const durationMap: { [key: string]: string } = {
      'Surfing': '4 hours',
      'Snorkeling': '3 hours',
      'Yoga': '1 hour',
      'Temple Visits': '2 hours',
      'Shopping': '3 hours',
      'Sushi Making': '2 hours',
      'Cherry Blossom Viewing': '2 hours',
      'Sunset Viewing': '1 hour',
      'Wine Tasting': '3 hours',
      'Beach Hopping': '6 hours',
      'Photography': '4 hours',
      'Wildlife Spotting': '6 hours',
      'Zip-lining': '2 hours',
      'Volcano Hiking': '8 hours',
      'Coffee Tour': '2 hours',
      'Northern Lights': '4 hours',
      'Glacier Hiking': '6 hours',
      'Blue Lagoon': '3 hours',
      'Geyser Watching': '2 hours',
      'Camel Trekking': '4 hours',
      'Desert Camping': '12 hours',
      'Souk Shopping': '3 hours',
      'Atlas Mountains': '8 hours',
      'Hiking': '4 hours',
      'Bungee Jumping': '1 hour',
      'Milford Sound': '4 hours',
      'Burj Khalifa': '2 hours',
      'Desert Safari': '6 hours',
      'Luxury Dining': '2 hours',
      'Palm Jumeirah': '4 hours',
      'Gold Souk': '2 hours'
    };

    return durationMap[activityName] || '2 hours';
  }
}

export const jsonDataService = new JsonDataService();
export default jsonDataService;
