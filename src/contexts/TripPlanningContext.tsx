import  { createContext, useContext, useState, type ReactNode } from 'react';
import type { TripPlanningRequest, TripPlan } from '../types';

interface TripPlanningContextType {
  tripRequest: TripPlanningRequest | null;
  tripPlan: TripPlan | null;
  setTripRequest: (request: TripPlanningRequest) => void;
  setTripPlan: (plan: TripPlan | null) => void;
  clearTripData: () => void;
}

const TripPlanningContext = createContext<TripPlanningContextType | undefined>(undefined);

interface TripPlanningProviderProps {
  children: ReactNode;
}

export function TripPlanningProvider({ children }: TripPlanningProviderProps) {
  const [tripRequest, setTripRequest] = useState<TripPlanningRequest | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const clearTripData = () => {
    setTripRequest(null);
    setTripPlan(null);
  };

  return (
    <TripPlanningContext.Provider
      value={{
        tripRequest,
        tripPlan,
        setTripRequest,
        setTripPlan,
        clearTripData,
      }}
    >
      {children}
    </TripPlanningContext.Provider>
  );
}

export function useTripPlanning() {
  const context = useContext(TripPlanningContext);
  if (context === undefined) {
    throw new Error('useTripPlanning must be used within a TripPlanningProvider');
  }
  return context;
}
