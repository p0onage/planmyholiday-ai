import { useState } from 'react';
import type { Accommodation, TripPlanningRequest } from '../../types';

interface AccommodationStepProps {
  request: TripPlanningRequest;
  accommodation: Accommodation[];
  selectedAccommodation: string[];
  onToggleAccommodation: (accommodationId: string) => void;
  onCustomInputChange: (input: string) => void;
  onRefreshAI: () => void;
  isLoading: boolean;
}

export default function AccommodationStep({
  request,
  accommodation,
  selectedAccommodation,
  onToggleAccommodation,
  onRefreshAI,
  isLoading
}: AccommodationStepProps) {
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'location' | 'theme_match'>('price');
  const [selectedAccommodationItem, setSelectedAccommodationItem] = useState<Accommodation | null>(null);

  const totalNights = request.duration || 7;

  // Mock accommodation images - in real app these would come from the accommodation data
  const getAccommodationImage = (accommodation: Accommodation) => {
    const imageMap: { [key: string]: string } = {
      'resort': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
      'villa': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
      'hotel': 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
      'apartment': 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center',
      'hostel': 'https://images.unsplash.com/photo-1555854877-bab0e828d46f?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[accommodation.type] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Accommodation</h2>
      </div>

      <div className="space-y-6">

        {/* Sort and Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="location">Location</option>
              <option value="theme_match">Theme Match</option>
            </select>
          </div>
          
          <button
            onClick={onRefreshAI}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isLoading ? 'Loading...' : 'Refresh AI'}
          </button>
        </div>

        {/* Accommodation Horizontal Scroll */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Refreshing accommodation based on your selections...</span>
              </div>
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {accommodation.map((acc) => (
              <AccommodationCard
                key={acc.id}
                accommodation={acc}
                isSelected={selectedAccommodation.includes(acc.id)}
                onToggle={() => onToggleAccommodation(acc.id)}
                onInfoClick={() => setSelectedAccommodationItem(acc)}
                imageUrl={getAccommodationImage(acc)}
                totalNights={totalNights}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Accommodation Info Modal */}
      {selectedAccommodationItem && (
        <AccommodationModal
          accommodation={selectedAccommodationItem}
          onClose={() => setSelectedAccommodationItem(null)}
          imageUrl={getAccommodationImage(selectedAccommodationItem)}
          totalNights={totalNights}
        />
      )}
    </div>
  );
}

interface AccommodationCardProps {
  accommodation: Accommodation;
  isSelected: boolean;
  onToggle: () => void;
  onInfoClick: () => void;
  imageUrl: string;
  totalNights: number;
}

function AccommodationCard({ accommodation, isSelected, onToggle, onInfoClick, imageUrl, totalNights }: AccommodationCardProps) {
  const totalCost = accommodation.pricePerNight * totalNights;

  return (
    <div className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-28">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        {/* Selection Button */}
        <button
          onClick={onToggle}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-200 ${
            isSelected
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSelected ? '×' : '+'}
        </button>

        {/* Info Button */}
        <button
          onClick={onInfoClick}
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center text-white text-sm transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
      
      {/* Content Below Image */}
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-2">{accommodation.name}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{accommodation.rating}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>${accommodation.pricePerNight}/night</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{accommodation.distanceToBeach}</span>
        </div>

        <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium">Total: ${totalCost.toLocaleString()}</span>
          <span className="text-gray-500"> for {totalNights} nights</span>
        </div>

        {/* Selection Status */}
        {isSelected ? (
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Selected
          </div>
        ) : (
          <button
            onClick={onToggle}
            className="w-full py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium transition-colors"
          >
            Select
          </button>
        )}
      </div>
    </div>
  );
}

interface AccommodationModalProps {
  accommodation: Accommodation;
  onClose: () => void;
  imageUrl: string;
  totalNights: number;
}

function AccommodationModal({ accommodation, onClose, imageUrl, totalNights }: AccommodationModalProps) {
  // Mock additional images for the modal
  const additionalImages = [
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&crop=center'
  ];

  const totalCost = accommodation.pricePerNight * totalNights;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{accommodation.name}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content - Vertically Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Main Image */}
          <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} />
          
          {/* Accommodation Details */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{accommodation.rating}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-medium">${accommodation.pricePerNight}/night</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{accommodation.distanceToBeach}</span>
                </div>
              </div>
            </div>

            {/* Total Cost */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-center">
                <span className="text-sm text-gray-600">Total for {totalNights} nights: </span>
                <span className="text-lg font-semibold text-blue-600">${totalCost.toLocaleString()}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Experience luxury and comfort at {accommodation.name}. This {accommodation.type} offers 
                {accommodation.theme} themed accommodations with modern amenities and excellent service. 
                Perfect for your {totalNights}-night stay with easy access to local attractions.
              </p>
            </div>

            {/* Additional Images */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">More Photos</h4>
              <div className="grid grid-cols-2 gap-2">
                {additionalImages.map((img, index) => (
                  <div
                    key={index}
                    className="h-24 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free WiFi</li>
                <li>• Swimming pool</li>
                <li>• Restaurant on-site</li>
                <li>• Room service</li>
                <li>• Concierge service</li>
                <li>• Parking available</li>
                <li>• Air conditioning</li>
                <li>• Daily housekeeping</li>
              </ul>
            </div>

            {/* Location Details */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Location</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {accommodation.distanceToBeach}</li>
                <li>• Walking distance to city center</li>
                <li>• Near public transportation</li>
                <li>• Close to shopping areas</li>
                <li>• Airport shuttle available</li>
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Policies</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check-in: 3:00 PM</li>
                <li>• Check-out: 11:00 AM</li>
                <li>• Free cancellation up to 24 hours before</li>
                <li>• No smoking in rooms</li>
                <li>• Pet-friendly (additional fee)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
