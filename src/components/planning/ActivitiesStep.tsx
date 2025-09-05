import { useState } from 'react';
import type { Activity, TripPlanningRequest } from '../../types';

interface ActivitiesStepProps {
  request: TripPlanningRequest;
  activities: Activity[];
  selectedActivities: string[];
  onToggleActivity: (activityId: string) => void;
  onCustomInputChange: (input: string) => void;
  onRefreshAI: () => void;
  isLoading: boolean;
}

export default function ActivitiesStep({
  activities,
  selectedActivities,
  onToggleActivity,
  onCustomInputChange,
  onRefreshAI,
  isLoading
}: ActivitiesStepProps) {
  const [customInput, setCustomInput] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price' | 'theme_match'>('popularity');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleCustomInputSubmit = () => {
    onCustomInputChange(customInput);
    setCustomInput('');
  };


  // Mock activity images - in real app these would come from the activity data
  const getActivityImage = (activity: Activity) => {
    const imageMap: { [key: string]: string } = {
      'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop&crop=center',
      'culture': 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&crop=center',
      'adventure': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
      'food': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center',
      'relaxation': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&crop=center'
    };
    return imageMap[activity.type] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Activities</h2>
      </div>

      <div className="space-y-6">
        {/* Customize Activities Input */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-700">Customize Activities Input</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Preferred activities, interests, special requirements..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomInputSubmit()}
              className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleCustomInputSubmit}
              disabled={!customInput.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="theme_match">Match Theme</option>
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

        {/* Activities Horizontal Scroll */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Refreshing activities based on your selections...</span>
              </div>
            </div>
          )}
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isSelected={selectedActivities.includes(activity.id)}
                onToggle={() => onToggleActivity(activity.id)}
                onInfoClick={() => setSelectedActivity(activity)}
                imageUrl={getActivityImage(activity)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Activity Info Modal */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
          imageUrl={getActivityImage(selectedActivity)}
        />
      )}
    </div>
  );
}

interface ActivityCardProps {
  activity: Activity;
  isSelected: boolean;
  onToggle: () => void;
  onInfoClick: () => void;
  imageUrl: string;
}

function ActivityCard({ activity, isSelected, onToggle, onInfoClick, imageUrl }: ActivityCardProps) {
  return (
    <div className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="relative h-40">
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
        <h3 className="font-semibold text-gray-900 mb-2">{activity.name}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{activity.rating}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>${activity.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{activity.date}</span>
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

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
  imageUrl: string;
}

function ActivityModal({ activity, onClose, imageUrl }: ActivityModalProps) {
  // Mock additional images for the modal
  const additionalImages = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop&crop=center'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
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
          
          {/* Activity Details */}
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">{activity.rating}/5</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="font-medium">${activity.price}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{activity.date}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Experience the best of {activity.name.toLowerCase()} with this amazing activity. 
                Perfect for {activity.type === 'beach' ? 'beach lovers' : activity.type === 'culture' ? 'culture enthusiasts' : 'adventure seekers'}, 
                this experience offers unforgettable memories and stunning views.
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

            {/* What's Included */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What's Included</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Professional guide</li>
                <li>• All necessary equipment</li>
                <li>• Transportation to/from location</li>
                <li>• Refreshments</li>
                <li>• Insurance coverage</li>
              </ul>
            </div>

            {/* Important Notes */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Important Notes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Minimum age: 12 years</li>
                <li>• Moderate fitness level required</li>
                <li>• Weather dependent activity</li>
                <li>• Bring comfortable walking shoes</li>
                <li>• Camera recommended</li>
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
