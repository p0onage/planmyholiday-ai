import { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Hero from './components/Hero';
import TripGrid from './components/TripGrid';
import TripDetailModal from './components/TripDetailModal';
import type { Trip } from './types';
import baliImage from './assets/images/surf-in-bali.jpg';

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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('Journey');
  const [trips, setTrips] = useState<Trip[]>(demoTrips);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Simulate AI agent interaction
  const handlePlan = (prompt: string): void => {
    // For now, just filter demoTrips by prompt keywords
    const filtered = demoTrips.filter(trip =>
      trip.name.toLowerCase().includes(prompt.toLowerCase()) ||
      trip.types.some(type => type.toLowerCase().includes(prompt.toLowerCase()))
    );
    setTrips(filtered.length ? filtered : demoTrips);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-2">
        <Tabs active={activeTab} onChange={setActiveTab} />
        <Hero onPlan={handlePlan} />
        <TripGrid trips={trips} onView={setSelectedTrip} />
        <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
      </main>
    </div>
  );
}
