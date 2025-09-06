import { useState, useEffect } from 'react';
import type { TripPlanningRequest } from '../../types';

interface DestinationStepProps {
  request: TripPlanningRequest;
  onRequestChange: (updates: Partial<TripPlanningRequest>) => void;
}

export default function DestinationStep({ request, onRequestChange }: DestinationStepProps) {
  const [availableDestinations, setAvailableDestinations] = useState<Array<{
    name: string;
    key: string;
    image: string;
    description: string;
  }>>([]);

  // Load available destinations from JSON data
  useEffect(() => {
    const destinations = [
      {
        name: 'Bali, Indonesia',
        key: 'bali',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
        description: 'Tropical Paradise'
      },
      {
        name: 'Tokyo, Japan',
        key: 'tokyo',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
        description: 'Modern Metropolis'
      },
      {
        name: 'Santorini, Greece',
        key: 'santorini',
        image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&crop=center',
        description: 'Romantic Sunset'
      }
    ];
    setAvailableDestinations(destinations);
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
            {availableDestinations.map((destination) => {
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
                      style={{ backgroundImage: `url(${destination.image})` }}
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
            })}
          </div>
        </div>


      </div>
    </div>
  );
}
