import { useState } from 'react';
import type { ItineraryItem, Activity, Transportation, Accommodation, TripPlanningRequest } from '../../types';
import type { Currency } from '../../types/location';

interface HolidayPreviewProps {
  itinerary: ItineraryItem[];
  totalBudget: number;
  actualCost: number;
  onRegeneratePlan: () => void;
  onCustomize: () => void;
  onBookNow: () => void;
  selectedActivities?: Activity[];
  selectedAccommodation?: Accommodation[];
  selectedTransportation?: Transportation[];
  request?: TripPlanningRequest;
  onRequestChange?: (updates: Partial<TripPlanningRequest>) => void;
  currency?: Currency | null; // Currency from location provider
}

export default function HolidayPreview({
  totalBudget,
  actualCost,
  onRegeneratePlan,
  onBookNow,
  selectedActivities = [],
  selectedAccommodation = [],
  selectedTransportation = [],
  request,
  onRequestChange,
  currency = null
}: HolidayPreviewProps) {
  const [aiMessage, setAiMessage] = useState<string>('');
  const [lastMessage, setLastMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState<boolean>(false);
  const isWithinBudget = actualCost <= totalBudget;

  // Currency formatting helper
  const formatCurrency = (amount: number) => {
    const symbol = currency?.symbol || '$';
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Calculate costs for each section
  const activitiesCost = selectedActivities.reduce((sum, activity) => sum + activity.price, 0);
  const accommodationCost = selectedAccommodation.reduce((sum, acc) => sum + (acc.pricePerNight * acc.totalNights), 0);
  const transportationCost = selectedTransportation.reduce((sum, transport) => sum + transport.price, 0);

  // Get images for cards
  const getActivityImage = (activity: Activity) => {
    const imageMap: { [key: string]: string } = {
      'Surfing in Canggu': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center',
      'Temple Tour': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      'Cooking Class': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center',
      'Spa Treatment': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop&crop=center',
      'Volcano Hiking': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[activity.name] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center';
  };

  const getAccommodationImage = (accommodation: Accommodation) => {
    const imageMap: { [key: string]: string } = {
      'Luxury Resort': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center',
      'Boutique Hotel': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&crop=center',
      'Villa Rental': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop&crop=center',
      'Hostel': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[accommodation.name] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop&crop=center';
  };

  const getTransportImage = (transport: Transportation) => {
    const imageMap: { [key: string]: string } = {
      'Direct Flight': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop&crop=center',
      'Scooter Rental': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
      'Taxi Service': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
      'Car Rental': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[transport.name] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop&crop=center';
  };

  // Destination helper functions
  const getDestinationImage = (destination: string) => {
    const imageMap: { [key: string]: string } = {
      'Bali, Indonesia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      'Tokyo, Japan': 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
      'Santorini, Greece': 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[destination] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center';
  };

  const getDestinationTitle = (destination: string) => {
    const titleMap: { [key: string]: string } = {
      'Bali, Indonesia': 'Bali Tropical Escape',
      'Tokyo, Japan': 'Tokyo Urban Adventure',
      'Santorini, Greece': 'Santorini Sunset Romance'
    };
    return titleMap[destination] || destination;
  };

  const getDestinationDescription = (destination: string) => {
    const descriptionMap: { [key: string]: string } = {
      'Bali, Indonesia': 'Beaches & Islands',
      'Tokyo, Japan': 'Modern Metropolis',
      'Santorini, Greece': 'Romantic Sunset'
    };
    return descriptionMap[destination] || 'Adventure Awaits';
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    if (onRequestChange && request) {
      onRequestChange({ [field]: value });
    }
  };

  const handleNumberChange = (field: 'adults' | 'children' | 'budget', value: number) => {
    if (onRequestChange && request) {
      onRequestChange({ [field]: value });
    }
  };

  const handleTextChange = (field: 'departureCity', value: string) => {
    if (onRequestChange && request) {
      onRequestChange({ [field]: value });
    }
  };

  const handleAiMessageChange = (value: string) => {
    setAiMessage(value);
  };

  const handleSendMessage = async () => {
    if (!aiMessage.trim()) return;
    
    setIsLoading(true);
    setLastMessage(aiMessage);
    
    // Simulate AI processing (replace with actual AI API call)
    setTimeout(() => {
      console.log('AI Message sent:', aiMessage);
      setAiMessage('');
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const calculateDuration = () => {
    if (!request) return 0;
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Holiday Preview</h2>
        <p className="text-sm text-gray-600 mt-1">Review your selected options</p>
      </div>

      <div className="space-y-6">
        {/* AI Communication Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
          </div>
          
          {/* Last Message Display */}
          {lastMessage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-h-32 overflow-y-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{lastMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* AI Input Box */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Ask AI for help with your holiday planning</label>
            <div className="relative">
              <textarea
                value={aiMessage}
                onChange={(e) => handleAiMessageChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your holiday... (e.g., 'Suggest activities for families', 'Find budget-friendly accommodation')"
                className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={isLoading}
              />
              <div className="absolute right-2 bottom-2 flex flex-col gap-1">
                {isLoading ? (
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <button
                    onClick={handleSendMessage}
                    disabled={!aiMessage.trim() || isLoading}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
          </div>
        </div>

        {/* Fine-Grained Settings Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-700">Fine-Grained Settings</h3>
              <span className="text-xs text-gray-500">Customize your search preferences</span>
            </div>
            <button
              onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              {isSettingsExpanded ? (
                <>
                  <span>Collapse</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  <span>Expand</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isSettingsExpanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4">
              {/* Travel Details Form */}
              {request && onRequestChange && (
                <div className="space-y-4">
                  {/* Travel Dates */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Travel Dates</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                        <input
                          type="date"
                          value={request.startDate}
                          onChange={(e) => handleDateChange('startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                        <input
                          type="date"
                          value={request.endDate}
                          onChange={(e) => handleDateChange('endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Duration: {calculateDuration()} days
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
                        value={request.adults}
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
                        value={request.children}
                        onChange={(e) => handleNumberChange('children', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Budget ({currency?.symbol || '$'})</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={request.budget}
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
                      value={request.departureCity}
                      onChange={(e) => handleTextChange('departureCity', e.target.value)}
                      placeholder="Where are you departing from?"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Holiday Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Holiday</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {request?.destination ? (
              <div className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div 
                  className="h-28 bg-cover bg-center" 
                  style={{ 
                    backgroundImage: `url(${getDestinationImage(request.destination)})` 
                  }} 
                />
                <div className="p-3">
                  <h4 className="font-semibold text-gray-900 text-sm text-center leading-tight">{getDestinationTitle(request.destination)}</h4>
                  <p className="text-xs text-center leading-tight text-gray-600 mt-1">{getDestinationDescription(request.destination)}</p>
                </div>
              </div>
            ) : (
              <div className="flex-shrink-0 w-44 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No destination selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Activities Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Activities</h3>
            <span className="text-sm font-medium text-green-600">{formatCurrency(activitiesCost)}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedActivities.length > 0 ? (
              selectedActivities.map((activity) => (
                <div key={activity.id} className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${getActivityImage(activity)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm text-center leading-tight">{activity.name}</h4>
                    <p className="text-xs text-center text-gray-600 mt-1">{formatCurrency(activity.price)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-44 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No activities selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Accommodation Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Accommodation</h3>
            <span className="text-sm font-medium text-green-600">{formatCurrency(accommodationCost)}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedAccommodation.length > 0 ? (
              selectedAccommodation.map((accommodation) => (
                <div key={accommodation.id} className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${getAccommodationImage(accommodation)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm text-center leading-tight">{accommodation.name}</h4>
                    <p className="text-xs text-center text-gray-600 mt-1">{formatCurrency(accommodation.pricePerNight)}/night</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-44 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No accommodation selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Transportation Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Transportation</h3>
            <span className="text-sm font-medium text-green-600">{formatCurrency(transportationCost)}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedTransportation.length > 0 ? (
              selectedTransportation.map((transport) => (
                <div key={transport.id} className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-28 bg-cover bg-center" style={{ backgroundImage: `url(${getTransportImage(transport)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm text-center leading-tight">{transport.name}</h4>
                    <p className="text-xs text-center text-gray-600 mt-1">{formatCurrency(transport.price)}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-44 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No transportation selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Budget Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Total Budget:</span>
              <span className="text-lg font-semibold text-gray-900">{formatCurrency(totalBudget)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Estimated Cost:</span>
              <span className="text-lg font-semibold text-gray-900">{formatCurrency(actualCost)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`text-sm font-semibold ${isWithinBudget ? 'text-green-600' : 'text-red-600'}`}>
                {isWithinBudget ? 'Within budget' : 'Over budget'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRegeneratePlan}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate Plan
          </button>
          
          <button
            onClick={onBookNow}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
