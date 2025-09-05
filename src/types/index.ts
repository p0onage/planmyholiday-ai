export interface Trip {
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

export interface TripCardProps {
  trip: Trip;
  onView: (trip: Trip) => void;
}

export interface TripGridProps {
  trips: Trip[];
  onView: (trip: Trip) => void;
}

export interface TripDetailModalProps {
  trip: Trip | null;
  onClose: () => void;
}

export interface HeroProps {
  onPlan: (prompt: string) => void;
}

export interface TabsProps {
  active: string;
  onChange: (tab: string) => void;
}

export const TravelCategory = {
  Journey: 'Journey',
  Family: 'Family',
  Weekender: 'Weekender',
  City: 'City',
} as const;

export type TravelCategory = (typeof TravelCategory)[keyof typeof TravelCategory];

export interface TravelTabProps {
  activeTab?: TravelCategory;
  onTabChange?: (tab: TravelCategory) => void;
}

export type WhenOption = "flexible" | "month" | "exact";

export interface ExactDates {
  start: string;
  end: string;
}

export type DurationUnit = "days" | "weeks" | "months" | "years";

export interface TripPlannerFormValues {
  query: string;
  when: WhenOption;
  flexibleText: string;
  month: number;
  year: number;
  exactDates: ExactDates;
  durationValue: number;
  durationUnit: DurationUnit;
  budget: number;
  adults: number;
  kids: number;
}

// Re-export location types
export * from './location';