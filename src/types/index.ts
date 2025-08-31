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
