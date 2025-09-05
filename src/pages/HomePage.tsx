import { useState, useEffect } from 'react';
import { Tabs, TripGrid, TripDetailModal, SearchBar } from '../components/home';
import type { Trip } from '../types';
import { TravelCategory } from '../types';
import { tripService } from '../services/tripService';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TravelCategory>(TravelCategory.Journey);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load featured trips on component mount
  useEffect(() => {
    const loadFeaturedTrips = async () => {
      try {
        setLoading(true);
        setError(null);
        const featuredTrips = await tripService.getFeaturedTrips();
        setTrips(featuredTrips);
      } catch (err) {
        setError('Failed to load trips');
        console.error('Error loading trips:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedTrips();
  }, []);

  return (
    <>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <SearchBar />
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-gray-600">Loading featured trips...</div>
        </div>
      )}
      
      {error && (
        <div className="flex justify-center items-center py-12">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      )}
      
      {!loading && !error && (
        <TripGrid trips={trips} onView={setSelectedTrip} />
      )}
      
      <TripDetailModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} />
    </>
  );
}
