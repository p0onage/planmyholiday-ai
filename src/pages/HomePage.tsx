import { useState, useEffect, useRef } from 'react';
import heroBanner from '../assets/images/heroBanner.png';
import { FaGlobe, FaPlane, FaBicycle } from 'react-icons/fa';
import { Tabs, TripGrid, TripDetailModal, SearchBar } from '../components/home';
import type { Trip } from '../types';
import { TravelCategory } from '../types';
import { tripService } from '../services/tripService';

const heroTexts = [
  'Discover your dream destination',
  'AI that plans, you just pack',
  'Flights, hotels, and adventures - all in one place',
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TravelCategory>(TravelCategory.Journey);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hero image pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
  const [zoom, setZoom] = useState(1.2);
  const direction = useRef({ x: 1, y: 1 });
  const speed = 0.5;
  // Limit pan so movement stays within the image bounds
  const maxOffset = { x: 60, y: 60 };

  // Typing effect state
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);

  // Animate hero image pan
  useEffect(() => {
    let animationFrame: number;
    function animate() {
      setOffset(prev => {
        let nextX = prev.x + direction.current.x * speed;
        let nextY = prev.y + direction.current.y * speed;
        if (nextX > maxOffset.x || nextX < -maxOffset.x) direction.current.x *= -1;
        if (nextY > maxOffset.y || nextY < -maxOffset.y) direction.current.y *= -1;
        nextX = Math.max(-maxOffset.x, Math.min(maxOffset.x, nextX));
        nextY = Math.max(-maxOffset.y, Math.min(maxOffset.y, nextY));
        return { x: nextX, y: nextY };
      });
      // Add gentle tilt and random zoom
      setTilt(Math.sin(Date.now() / 1200) * 4); // oscillate between -4deg and 4deg
      setZoom(1.15 + Math.sin(Date.now() / 3000) * 0.1 + Math.cos(Date.now() / 5000) * 0.05); // zoom between ~1.1 and ~1.3
      animationFrame = requestAnimationFrame(animate);
    }
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Typing effect logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (typing) {
      if (charIndex < heroTexts[textIndex].length) {
        timeout = setTimeout(() => {
          setDisplayText(heroTexts[textIndex].slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 60);
      } else {
        // Pause after typing
        timeout = setTimeout(() => {
          setTyping(false);
        }, 1800);
      }
    } else {
      // Remove text, then type next
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 30);
      } else {
        setTyping(true);
        setCharIndex(0);
        setTextIndex((textIndex + 1) % heroTexts.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [typing, charIndex, displayText, textIndex]);

  // Load featured trips
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
      <div className="w-full flex justify-center py-8 relative">
        <div
          className="overflow-hidden rounded-2xl shadow-lg w-full max-w-7xl"
          style={{ height: 520, background: 'transparent' }}
        >
          <img
            src={heroBanner}
            alt="PlanMyHoliday Hero Banner"
            style={{
              width: '120%',
              height: '120%',
              objectFit: 'cover',
              transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y -50}px) rotate(${tilt}deg)`,
              transition: 'transform 0.1s linear',
            }}
            className="select-none pointer-events-none"
          />
          {/* Overlay text at bottom left */}
          <div className="absolute left-8 bottom-8 text-white text-2xl md:text-3xl font-bold flex items-center drop-shadow-lg">
            <span>{displayText}</span>
            {charIndex === heroTexts[textIndex].length && (
              <span className="ml-3">
                {textIndex === 0 && <FaGlobe />}
                {textIndex === 1 && <FaPlane />}
                {textIndex === 2 && <FaBicycle />}
              </span>
            )}
          </div>
        </div>
      </div>
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
