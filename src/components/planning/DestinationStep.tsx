import { useState } from 'react';
import type { TripPlanningRequest } from '../../types';

interface DestinationStepProps {
  request: TripPlanningRequest;
  onRequestChange: (updates: Partial<TripPlanningRequest>) => void;
}

export default function DestinationStep({ request, onRequestChange }: DestinationStepProps) {
  const [localRequest, setLocalRequest] = useState<TripPlanningRequest>(request);
  const [hasChanges, setHasChanges] = useState(false);

  const calculateDuration = () => {
    const start = new Date(localRequest.startDate);
    const end = new Date(localRequest.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleInputChange = (field: keyof TripPlanningRequest, value: any) => {
    setLocalRequest(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    handleInputChange(field, value);
  };

  const handleNumberChange = (field: 'adults' | 'children' | 'budget', value: number) => {
    handleInputChange(field, value);
  };

  const handleTextChange = (field: 'destination' | 'departureCity', value: string) => {
    handleInputChange(field, value);
  };

  const handleApplyChanges = () => {
    onRequestChange(localRequest);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalRequest(request);
    setHasChanges(false);
  };

  const duration = calculateDuration();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Destination</h2>
      </div>

      <div className="space-y-6">
        {/* Travel Dates */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Travel Dates</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <input
                type="date"
                value={localRequest.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <input
                type="date"
                value={localRequest.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Duration: {duration} days
          </div>
        </div>

        {/* Travelers and Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Adults</label>
            <input
              type="number"
              min="1"
              max="20"
              value={localRequest.adults}
              onChange={(e) => handleNumberChange('adults', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Children</label>
            <input
              type="number"
              min="0"
              max="20"
              value={localRequest.children}
              onChange={(e) => handleNumberChange('children', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Budget ($)</label>
            <input
              type="number"
              min="0"
              step="100"
              value={localRequest.budget}
              onChange={(e) => handleNumberChange('budget', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Departure City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Departure City</label>
          <input
            type="text"
            value={localRequest.departureCity}
            onChange={(e) => handleTextChange('departureCity', e.target.value)}
            placeholder="Where are you departing from?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Holiday Destinations - Horizontal Scrollable Cards */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Choose Your Holiday</label>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { 
                name: 'Bali Tropical Escape', 
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
                description: 'Beaches & Islands',
                key: 'bali_tropical'
              },
              { 
                name: 'Swiss Alps Adventure', 
                image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
                description: 'Hiking & Outdoor',
                key: 'swiss_adventure'
              },
              { 
                name: 'Rome Cultural Journey', 
                image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&crop=center',
                description: 'History & Art',
                key: 'rome_culture'
              },
              { 
                name: 'Thailand Wellness Retreat', 
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
                description: 'Spa & Wellness',
                key: 'thailand_relaxation'
              },
              { 
                name: 'Tuscany Food & Wine', 
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
                description: 'Culinary Tours',
                key: 'tuscany_food'
              },
              { 
                name: 'Maldives Beach Paradise', 
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
                description: 'Coastal Getaway',
                key: 'maldives_beach'
              },
              { 
                name: 'Tokyo City Break', 
                image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
                description: 'Urban Exploration',
                key: 'tokyo_city'
              },
              { 
                name: 'Costa Rica Nature', 
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center',
                description: 'Wildlife & Parks',
                key: 'costa_rica_nature'
              }
            ].map((theme) => {
              const isSelected = localRequest.preferences?.themes?.includes(theme.key);
              return (
                <div
                  key={theme.key}
                  className={`flex-shrink-0 w-44 rounded-lg border-2 transition-all duration-200 overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  {/* Image Container */}
                  <div className="relative h-28">
                    {/* Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${theme.image})` }}
                    />
                    
                    {/* Selection Button Overlay */}
                    <button
                      className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-500 hover:bg-blue-600'
                          : 'bg-black bg-opacity-50 hover:bg-opacity-70'
                      }`}
                      onClick={() => {
                        // Only allow one theme selection
                        const newThemes = isSelected ? [] : [theme.key];
                        handleInputChange('preferences', { 
                          ...localRequest.preferences, 
                          themes: newThemes 
                        });
                      }}
                    >
                      {isSelected ? '✓' : '+'}
                    </button>
                  </div>
                  
                  {/* Content Below Image */}
                  <div className="p-3 bg-white">
                    <div className="text-sm font-semibold text-center leading-tight text-gray-900">
                      {theme.name}
                    </div>
                    <div className="text-xs text-center leading-tight text-gray-600 mt-1">
                      {theme.description}
                    </div>
                  </div>
            </div>
              );
            })}
          </div>
        </div>

        {/* Apply/Reset Buttons */}
        {hasChanges && (
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleApplyChanges}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Apply Changes
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
