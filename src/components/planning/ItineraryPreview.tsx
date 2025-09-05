import type { ItineraryItem, Activity, Transportation, Accommodation } from '../../types';

interface ItineraryPreviewProps {
  itinerary: ItineraryItem[];
  totalBudget: number;
  actualCost: number;
  onRegeneratePlan: () => void;
  onCustomize: () => void;
  onBookNow: () => void;
  selectedActivities?: Activity[];
  selectedAccommodation?: Accommodation[];
  selectedTransportation?: Transportation[];
}

export default function ItineraryPreview({
  totalBudget,
  actualCost,
  onRegeneratePlan,
  onBookNow,
  selectedActivities = [],
  selectedAccommodation = [],
  selectedTransportation = []
}: ItineraryPreviewProps) {
  const isWithinBudget = actualCost <= totalBudget;

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Holiday Preview</h2>
        <p className="text-sm text-gray-600 mt-1">Review your selected options</p>
      </div>

      <div className="space-y-6">
        {/* Selected Holiday Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Holiday</h3>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-40 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center)' }} />
              <div className="p-3">
                <h4 className="font-semibold text-gray-900">Bali Tropical Escape</h4>
                <p className="text-sm text-gray-600">Beaches & Islands</p>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Activities Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Activities</h3>
            <span className="text-sm font-medium text-green-600">${activitiesCost}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedActivities.length > 0 ? (
              selectedActivities.map((activity) => (
                <div key={activity.id} className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${getActivityImage(activity)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{activity.name}</h4>
                    <p className="text-xs text-gray-600">${activity.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-48 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No activities selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Accommodation Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Accommodation</h3>
            <span className="text-sm font-medium text-green-600">${accommodationCost}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedAccommodation.length > 0 ? (
              selectedAccommodation.map((accommodation) => (
                <div key={accommodation.id} className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${getAccommodationImage(accommodation)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{accommodation.name}</h4>
                    <p className="text-xs text-gray-600">${accommodation.pricePerNight}/night</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-48 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-500">No accommodation selected</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Transportation Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Selected Transportation</h3>
            <span className="text-sm font-medium text-green-600">${transportationCost}</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {selectedTransportation.length > 0 ? (
              selectedTransportation.map((transport) => (
                <div key={transport.id} className="flex-shrink-0 w-48 bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${getTransportImage(transport)})` }} />
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{transport.name}</h4>
                    <p className="text-xs text-gray-600">${transport.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-shrink-0 w-48 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
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
              <span className="text-lg font-semibold text-gray-900">${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Estimated Cost:</span>
              <span className="text-lg font-semibold text-gray-900">${actualCost.toLocaleString()}</span>
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
