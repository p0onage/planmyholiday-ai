import { useState } from 'react';
import { Tabs, TripGrid, TripDetailModal, SearchBar } from '../components/home';
import type { Trip } from '../types';
import { TravelCategory } from '../types';
import baliImage from '../assets/images/surf-in-bali.jpg';

// Demo data for initial UI
const demoTrips: Trip[] = [
  {
    id: 1,
    name: 'Bali Surf Adventure',
    location: 'Bali, Indonesia',
    image: baliImage,
    types: ['Watersports', 'Beach', 'Adventure'],
    rating: '9.3',
    activities: ['Surfing', 'Snorkeling', 'Yoga'],
    budget: 'Mid-range ($$)',
    itinerary: [
      'Day 1: Arrival & Beach',
      'Day 2: Surf lessons',
      'Day 3: Explore Ubud',
    ],
  },
  // Add more demo trips as needed
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TravelCategory>(TravelCategory.Journey);
  const [trips] = useState<Trip[]>(demoTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar />
      <TripGrid trips={trips} onView={setSelectedTrip} />
      <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </>
  );
}
