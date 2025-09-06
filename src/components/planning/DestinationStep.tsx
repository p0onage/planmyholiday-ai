import { useState, useEffect } from 'react';
import type { TripPlanningRequest } from '../../types';
import { jsonDataService } from '../../services/jsonDataService';

interface DestinationStepProps {
  request: TripPlanningRequest;
  onRequestChange: (updates: Partial<TripPlanningRequest>) => void;
}

export default function DestinationStep({ request, onRequestChange }: DestinationStepProps) {
  const [availableDestinations, setAvailableDestinations] = useState<Array<{
    name: string;
    key: string;
    image: string | undefined;
    description: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load available destinations from JSON data service
  useEffect(() => {
    try {
      const destinations = jsonDataService.getDestinationsWithImages();
      setAvailableDestinations(destinations);
    } catch (error) {
      console.error('Failed to load destinations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDestinationChange = (destinationKey: string) => {
    const destination = availableDestinations.find(d => d.key === destinationKey);
    if (destination) {
      onRequestChange({ destination: destination.name });
    }
  };


  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Destination</h2>
      </div>

      <div className="space-y-6">


        {/* Holiday Destinations - Horizontal Scrollable Cards */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Choose Your Holiday Destination</label>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {isLoading ? (
              // Loading state
              <div className="flex-shrink-0 w-44 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-500">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm">Loading...</span>
                </div>
              </div>
            ) : availableDestinations.length === 0 ? (
              // Empty state
              <div className="flex-shrink-0 w-44 h-32 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <p className="text-sm">No destinations available</p>
                  <p className="text-xs mt-1">Try the AI chat to get started</p>
                </div>
              </div>
            ) : (
              availableDestinations.map((destination) => {
              const isSelected = request.destination === destination.name;
              return (
                <div
                  key={destination.key}
                  className={`flex-shrink-0 w-44 rounded-lg border-2 transition-all duration-200 overflow-hidden cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => handleDestinationChange(destination.key)}
                >
                  {/* Image Container */}
                  <div className="relative h-28">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: destination.image ? `url(${destination.image})` : 'none' }}
                    />
                    
                    {/* Selection Button Overlay */}
                    <div
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-500'
                          : 'bg-black bg-opacity-50'
                      }`}
                    >
                      {isSelected ? '✓' : '+'}
                    </div>
                  </div>
                  
                  {/* Content Below Image */}
                  <div className="p-3 bg-white">
                    <div className="text-sm font-semibold text-center leading-tight text-gray-900">
                      {destination.name}
                    </div>
                    <div className="text-xs text-center leading-tight text-gray-600 mt-1">
                      {destination.description}
                    </div>
                    {isSelected && (
                      <div className="text-xs text-center text-blue-600 mt-1 font-medium">
                        Selected
                      </div>
                    )}
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
