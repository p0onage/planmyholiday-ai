import { useState, useEffect } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import { useLocation } from '../providers/LocationProvider';
import { useRealTimeTripPlanner } from '../hooks/useRealTimeTripPlanner';
import DestinationStep from '../components/planning/DestinationStep';
import ActivitiesStep from '../components/planning/ActivitiesStep';
import AccommodationStep from '../components/planning/AccommodationStep';
import TransportationStep from '../components/planning/TransportationStep';
import HolidayPreview from '../components/planning/HolidayPreview';
import LoadingSpinner from '../components/planning/LoadingSpinner';
import type { TripPlanningRequest } from '../types';

export default function HolidayPlanningPage() {
  const pageLocation = useRouterLocation();
  const { currency } = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Get form data from navigation state (passed from homepage search)
  const getFormData = (): TripPlanningRequest => {
    // Check if data was passed via navigation state
    const stateData = pageLocation.state as { tripRequest?: TripPlanningRequest; searchData?: any } | null;
    
    // Use form data if available, otherwise use empty values
    const searchData = stateData?.searchData;
    
    return {
      destination: '', // Will be set by AI/hook service
      departureCity: searchData?.departureCity || '',
      startDate: searchData?.when === 'exact' ? searchData.exactDates.start : new Date().toISOString().split('T')[0],
      endDate: searchData?.when === 'exact' ? searchData.exactDates.end : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: searchData?.durationValue || 0,
      adults: searchData?.adults || 0,
      children: searchData?.kids || 0,
      budget: searchData?.budget || 0,
      preferences: {
        activityTypes: [],
        accommodationTypes: [],
        transportationPreferences: []
      }
    };
  };

  const formData = getFormData();
  const hasFormData = pageLocation.state?.searchData;
  
  // Use the real-time trip planner hook
  const {
    currentRequest,
    selectedActivities,
    selectedAccommodation,
    selectedTransportation,
    tripPlan,
    activities,
    accommodation,
    journeySegments,
    isLoading,
    isActivitiesLoading,
    isAccommodationLoading,
    isTransportationLoading,
    error,
    updateRequest,
    toggleActivity,
    toggleAccommodation,
    toggleTransportation,
    updateCustomInput,
    searchActivities,
    searchAccommodation,
    searchTransportation,
    calculateTotalCost,
    getFilteredData,
    loadAllDataForRequest,
    handleAIChatMessage
  } = useRealTimeTripPlanner({
    initialRequest: formData,
    enableRealTimeUpdates: true,
    debounceMs: 500
  });
  
  // Handle initial data loading when there's a request from homepage
  useEffect(() => {
    if (hasFormData) {
      // Load all data and select first destination
      loadAllDataForRequest();
      
      // The search query will be passed to HolidayPreview as initialSearchQuery
      // and set as the lastMessage to show users what prompt generated their results
      pageLocation.state as { tripRequest?: TripPlanningRequest; searchData?: any } | null;

    }
  }, [hasFormData, loadAllDataForRequest, pageLocation.state]);

  // Handle request updates
  const handleRequestChange = (updates: Partial<TripPlanningRequest> | TripPlanningRequest) => {
    updateRequest(updates);
  };

  // Navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(4, step)));

  // Custom input handlers with search functionality
  const handleCustomInputChange = (section: 'activities' | 'accommodation' | 'transportation', input: string) => {
    updateCustomInput(section, input);
    console.log(`Custom input for ${section}:`, input);
    
    // Example of using search functions
    if (input.trim()) {
      switch (section) {
        case 'activities':
          const searchResults = searchActivities(input);
          console.log('Search results for activities:', searchResults);
          break;
        case 'accommodation':
          const accResults = searchAccommodation(input);
          console.log('Search results for accommodation:', accResults);
          break;
        case 'transportation':
          const transportResults = searchTransportation(input);
          console.log('Search results for transportation:', transportResults);
          break;
      }
    }
  };

  // Get data from the hook
  const itinerary = tripPlan?.itinerary || [];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleRegeneratePlan = () => {
    // Regenerate plan with current selections
    console.log('Regenerate plan');
  };

  const handleCustomize = () => {
    // Navigate to customization page or open modal
    console.log('Customize plan');
  };

  const handleBookNow = () => {
    // Navigate to booking page
    console.log('Book now');
  };

  // Show loading spinner while planning
  if (isLoading) {
    return <LoadingSpinner message="Planning your trip..." />;
  }

  // Show error state if API call failed
  if (error) {
    return (
      <div className="py-6">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-4">We couldn't plan your trip right now. Please try again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DestinationStep
            key={currentRequest?.destination || 'default'}
            request={currentRequest || formData}
            onRequestChange={handleRequestChange}
          />
        );
      case 2:
        return (
          <ActivitiesStep
            request={currentRequest || formData}
            activities={activities}
            selectedActivities={selectedActivities}
            onToggleActivity={toggleActivity}
            onCustomInputChange={(input) => handleCustomInputChange('activities', input)}
            onRefreshAI={() => console.log('Refresh AI for activities')}
            isLoading={isActivitiesLoading}
          />
        );
      case 3:
        return (
          <AccommodationStep
            request={currentRequest || formData}
            accommodation={accommodation}
            selectedAccommodation={selectedAccommodation}
            onToggleAccommodation={toggleAccommodation}
            onRefreshAI={() => console.log('Refresh AI for accommodation')}
            isLoading={isAccommodationLoading}
          />
        );
      case 4:
        return (
          <TransportationStep
            request={currentRequest || formData}
            journeySegments={journeySegments}
            selectedTransportation={selectedTransportation}
            onToggleTransportation={toggleTransportation}
            onRefreshAI={() => console.log('Refresh AI for transportation')}
            isLoading={isTransportationLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6 lg:py-8">
        {isMobile ? (
          // Mobile Layout - Step by step navigation
          <div className="space-y-6">
            {/* Current Step */}
            <div>
              {renderStep()}
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <span>◄</span>
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map((step) => (
                  <button
                    key={step}
                    onClick={() => goToStep(step)}
                    className={`w-3 h-3 rounded-full ${
                      step === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStep}
                disabled={currentStep === 4}
                className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
                <span>►</span>
              </button>
            </div>

            {/* Holiday Preview - Mobile Bottom */}
            <div>
              <HolidayPreview
                itinerary={itinerary}
                totalBudget={(currentRequest || formData).budget}
                actualCost={calculateTotalCost()}
                onRegeneratePlan={handleRegeneratePlan}
                onCustomize={handleCustomize}
                onBookNow={handleBookNow}
                selectedActivities={getFilteredData().selectedActivities}
                selectedAccommodation={getFilteredData().selectedAccommodation}
                selectedTransportation={getFilteredData().selectedTransportation}
                request={currentRequest || formData}
                onRequestChange={handleRequestChange}
                currency={currency}
                onAIChatMessage={handleAIChatMessage}
                initialSearchQuery={hasFormData ? (pageLocation.state as any)?.searchData?.query : ''}
                hasInitialRequest={!!hasFormData}
              />
            </div>
          </div>
        ) : (
          // Desktop Layout - Side by side with scrollable left panel
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 h-[calc(100vh-120px)]">
            {/* Left Panel - Scrollable Steps */}
            <div className="lg:col-span-3 overflow-y-auto">
              <div className="space-y-6">
                <DestinationStep
                  request={currentRequest || formData}
                  onRequestChange={handleRequestChange}
                />
                <ActivitiesStep
                  request={currentRequest || formData}
                  activities={activities}
                  selectedActivities={selectedActivities}
                  onToggleActivity={toggleActivity}
                  onCustomInputChange={(input) => handleCustomInputChange('activities', input)}
                  onRefreshAI={() => console.log('Refresh AI for activities')}
                  isLoading={isActivitiesLoading}
                />
                <AccommodationStep
                  request={currentRequest || formData}
                  accommodation={accommodation}
                  selectedAccommodation={selectedAccommodation}
                  onToggleAccommodation={toggleAccommodation}
                  onRefreshAI={() => console.log('Refresh AI for accommodation')}
                  isLoading={isAccommodationLoading}
                />
                <TransportationStep
                  request={currentRequest || formData}
                  journeySegments={journeySegments}
                  selectedTransportation={selectedTransportation}
                  onToggleTransportation={toggleTransportation}
                  onRefreshAI={() => console.log('Refresh AI for transportation')}
                  isLoading={isTransportationLoading}
                />
              </div>
            </div>

            {/* Right Panel - Fixed Holiday Preview */}
            <div className="lg:col-span-2">
              <div className="sticky top-6">
                <HolidayPreview
                  itinerary={itinerary}
                  totalBudget={(currentRequest || formData).budget}
                  actualCost={calculateTotalCost()}
                  onRegeneratePlan={handleRegeneratePlan}
                  onCustomize={handleCustomize}
                  onBookNow={handleBookNow}
                  selectedActivities={getFilteredData().selectedActivities}
                  selectedAccommodation={getFilteredData().selectedAccommodation}
                  selectedTransportation={getFilteredData().selectedTransportation}
                  request={currentRequest || formData}
                  onRequestChange={handleRequestChange}
                  currency={currency}
                  onAIChatMessage={handleAIChatMessage}
                  initialSearchQuery={hasFormData ? (pageLocation.state as any)?.searchData?.query : ''}
                  hasInitialRequest={!!hasFormData}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}