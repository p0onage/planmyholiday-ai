import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useGenerateTripPlan } from '../hooks/useTripPlanner';
import DestinationStep from '../components/planning/DestinationStep';
import ActivitiesStep from '../components/planning/ActivitiesStep';
import AccommodationStep from '../components/planning/AccommodationStep';
import TransportationStep from '../components/planning/TransportationStep';
import ItineraryPreview from '../components/planning/ItineraryPreview';
import LoadingSpinner from '../components/planning/LoadingSpinner';
import type { TripPlanningRequest, TripPlan } from '../types';

export default function HolidayPlanningPage() {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState<string[]>([]);
  const [selectedTransportation, setSelectedTransportation] = useState<string[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [currentRequest, setCurrentRequest] = useState<TripPlanningRequest | null>(null);
  const [refreshingSteps, setRefreshingSteps] = useState<{
    activities: boolean;
    accommodation: boolean;
    transportation: boolean;
  }>({
    activities: false,
    accommodation: false,
    transportation: false
  });

  // Get form data from navigation state (passed from homepage search)
  const getInitialRequest = (): TripPlanningRequest => {
    // Check if data was passed via navigation state
    const stateData = location.state as { tripRequest?: TripPlanningRequest; searchData?: any } | null;
    
    if (stateData?.tripRequest) {
      return stateData.tripRequest;
    }
    
    // Fallback to default values if no state data
    return {
      destination: 'Bali',
      departureCity: 'Amsterdam',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      duration: 7,
      adults: 2,
      children: 0,
      budget: 2000,
      preferences: {
        themes: ['tropical', 'adventure'],
        activityTypes: ['beach', 'culture'],
        accommodationTypes: ['resort', 'villa'],
        transportationPreferences: ['flight', 'local']
      }
    };
  };

  const initialRequest = getInitialRequest();
  
  // Initialize current request
  useEffect(() => {
    if (!currentRequest) {
      setCurrentRequest(initialRequest);
    }
  }, [initialRequest, currentRequest]);
  
  // Handle request updates
  const handleRequestChange = (updates: Partial<TripPlanningRequest> | TripPlanningRequest) => {
    // Check if it's a full request object or partial updates
    if ('preferences' in updates && 'startDate' in updates && 'endDate' in updates) {
      // Full request object from DestinationStep
      setCurrentRequest(updates as TripPlanningRequest);
      console.log('Destination filters applied, refreshing downstream options...');
      // Show loading states for all downstream steps
      setRefreshingSteps({
        activities: true,
        accommodation: true,
        transportation: true
      });
      
      // Simulate API refresh delay
      setTimeout(() => {
        setRefreshingSteps({
          activities: false,
          accommodation: false,
          transportation: false
        });
      }, 2000);
    } else {
      // Partial updates from other steps
      setCurrentRequest(prev => prev ? { ...prev, ...updates } : null);
      // Trigger refresh of downstream steps when theme changes
      if (updates.preferences?.themes) {
        console.log('Theme changed, refreshing downstream options...');
        // Show loading states for all downstream steps
        setRefreshingSteps({
          activities: true,
          accommodation: true,
          transportation: true
        });
        
        // Simulate API refresh delay
        setTimeout(() => {
          setRefreshingSteps({
            activities: false,
            accommodation: false,
            transportation: false
          });
        }, 2000);
      }
    }
  };

  // Use the hook to generate trip plan
  const { data: generatedTripPlan, isLoading, error } = useGenerateTripPlan(currentRequest || initialRequest);

  // Update trip plan when data is received
  useEffect(() => {
    if (generatedTripPlan) {
      setTripPlan(generatedTripPlan);
    }
  }, [generatedTripPlan]);

  // Navigation functions
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(Math.max(1, Math.min(4, step)));

  // Selection functions with context-aware refreshing
  const toggleActivity = (activityId: string) => {
    setSelectedActivities(prev => {
      const newSelection = prev.includes(activityId) 
        ? prev.filter(id => id !== activityId)
        : [...prev, activityId];
      
      // Trigger refresh of downstream steps (accommodation & transportation)
      console.log('Activity selection changed, refreshing accommodation and transportation options...');
      setRefreshingSteps(prev => ({
        ...prev,
        accommodation: true,
        transportation: true
      }));
      
      // Simulate API refresh delay
      setTimeout(() => {
        setRefreshingSteps(prev => ({
          ...prev,
          accommodation: false,
          transportation: false
        }));
      }, 1500);
      
      return newSelection;
    });
  };

  const toggleAccommodation = (accommodationId: string) => {
    setSelectedAccommodation(prev => {
      const newSelection = prev.includes(accommodationId) 
        ? prev.filter(id => id !== accommodationId)
        : [...prev, accommodationId];
      
      // Trigger refresh of downstream steps (transportation)
      console.log('Accommodation selection changed, refreshing transportation options...');
      setRefreshingSteps(prev => ({
        ...prev,
        transportation: true
      }));
      
      // Simulate API refresh delay
      setTimeout(() => {
        setRefreshingSteps(prev => ({
          ...prev,
          transportation: false
        }));
      }, 1000);
      
      return newSelection;
    });
  };

  const toggleTransportation = (transportationId: string) => {
    setSelectedTransportation(prev => {
      const newSelection = prev.includes(transportationId) 
        ? prev.filter(id => id !== transportationId)
        : [...prev, transportationId];
      
      // Final step - update trip plan with all selections
      console.log('Transportation selection changed, finalizing trip plan...');
      // In a real app, this would trigger final trip plan generation
      // with all selected activities, accommodation, and transportation
      
      return newSelection;
    });
  };

  const updateCustomInput = (section: 'activities' | 'accommodation' | 'transportation', value: string) => {
    console.log(`Custom input for ${section}:`, value);
  };

  // Get data from trip plan or use fallback mock data
  const activities = tripPlan?.activities || [];
  const accommodation = tripPlan?.accommodation || [];
  const transportation = tripPlan?.transportation || [];
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

  const handleCustomInputChange = (section: 'activities' | 'accommodation' | 'transportation', input: string) => {
    updateCustomInput(section, input);
    // Here you would trigger AI suggestions based on the input
    console.log(`Custom input for ${section}:`, input);
  };

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

  const calculateTotalCost = () => {
    const activityCost = activities
      .filter(activity => selectedActivities.includes(activity.id))
      .reduce((sum, activity) => sum + activity.price, 0);
    
    const accommodationCost = accommodation
      .filter(acc => selectedAccommodation.includes(acc.id))
      .reduce((sum, acc) => sum + (acc.pricePerNight * acc.totalNights), 0);
    
    const transportCost = transportation
      .filter(transport => selectedTransportation.includes(transport.id))
      .reduce((sum, transport) => sum + transport.price, 0);
    
    return activityCost + accommodationCost + transportCost;
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
            request={currentRequest || initialRequest}
            onRequestChange={handleRequestChange}
          />
        );
      case 2:
        return (
          <ActivitiesStep
            request={currentRequest || initialRequest}
            activities={activities}
            selectedActivities={selectedActivities}
            onToggleActivity={toggleActivity}
            onCustomInputChange={(input) => handleCustomInputChange('activities', input)}
            onRefreshAI={() => console.log('Refresh AI for activities')}
            isLoading={refreshingSteps.activities}
          />
        );
      case 3:
        return (
          <AccommodationStep
            request={currentRequest || initialRequest}
            accommodation={accommodation}
            selectedAccommodation={selectedAccommodation}
            onToggleAccommodation={toggleAccommodation}
            onCustomInputChange={(input) => handleCustomInputChange('accommodation', input)}
            onRefreshAI={() => console.log('Refresh AI for accommodation')}
            isLoading={refreshingSteps.accommodation}
          />
        );
      case 4:
        return (
          <TransportationStep
            request={currentRequest || initialRequest}
            selectedTransportation={selectedTransportation}
            onToggleTransportation={toggleTransportation}
            onCustomInputChange={(input) => handleCustomInputChange('transportation', input)}
            onRefreshAI={() => console.log('Refresh AI for transportation')}
            isLoading={refreshingSteps.transportation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-6">
        {isMobile ? (
          // Mobile Layout - Step by step navigation
          <div className="space-y-6">
            {/* Current Step */}
            <div>
              {renderStep()}
            </div>

            {/* Itinerary Preview - Mobile Bottom */}
            <div>
              <ItineraryPreview
                itinerary={itinerary}
                totalBudget={(currentRequest || initialRequest).budget}
                actualCost={calculateTotalCost()}
                onRegeneratePlan={handleRegeneratePlan}
                onCustomize={handleCustomize}
                onBookNow={handleBookNow}
                selectedActivities={activities.filter(activity => selectedActivities.includes(activity.id))}
                selectedAccommodation={accommodation.filter(acc => selectedAccommodation.includes(acc.id))}
                selectedTransportation={transportation.filter(transport => selectedTransportation.includes(transport.id))}
              />
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>◄</span>
                Back
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
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <span>►</span>
              </button>
            </div>
          </div>
        ) : (
          // Desktop Layout - Side by side with scrollable left panel
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
            {/* Left Panel - Scrollable Steps */}
            <div className="lg:col-span-2 overflow-y-auto pr-4">
              <div className="space-y-6">
                <DestinationStep
                  request={currentRequest || initialRequest}
                  onRequestChange={handleRequestChange}
                />
                <ActivitiesStep
                  request={currentRequest || initialRequest}
                  activities={activities}
                  selectedActivities={selectedActivities}
                  onToggleActivity={toggleActivity}
                  onCustomInputChange={(input) => handleCustomInputChange('activities', input)}
                  onRefreshAI={() => console.log('Refresh AI for activities')}
                  isLoading={refreshingSteps.activities}
                />
                <AccommodationStep
                  request={currentRequest || initialRequest}
                  accommodation={accommodation}
                  selectedAccommodation={selectedAccommodation}
                  onToggleAccommodation={toggleAccommodation}
                  onCustomInputChange={(input) => handleCustomInputChange('accommodation', input)}
                  onRefreshAI={() => console.log('Refresh AI for accommodation')}
                  isLoading={refreshingSteps.accommodation}
                />
                <TransportationStep
                  request={currentRequest || initialRequest}
                  selectedTransportation={selectedTransportation}
                  onToggleTransportation={toggleTransportation}
                  onCustomInputChange={(input) => handleCustomInputChange('transportation', input)}
                  onRefreshAI={() => console.log('Refresh AI for transportation')}
                  isLoading={refreshingSteps.transportation}
                />
              </div>
            </div>

            {/* Right Panel - Fixed Itinerary Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <ItineraryPreview
                  itinerary={itinerary}
                  totalBudget={(currentRequest || initialRequest).budget}
                  actualCost={calculateTotalCost()}
                  onRegeneratePlan={handleRegeneratePlan}
                  onCustomize={handleCustomize}
                  onBookNow={handleBookNow}
                  selectedActivities={activities.filter(activity => selectedActivities.includes(activity.id))}
                  selectedAccommodation={accommodation.filter(acc => selectedAccommodation.includes(acc.id))}
                  selectedTransportation={transportation.filter(transport => selectedTransportation.includes(transport.id))}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}