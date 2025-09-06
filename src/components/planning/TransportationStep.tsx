import { useState } from 'react';
import type { TripPlanningRequest } from '../../types';
import { useJourneySegments, useTransportOptions } from '../../hooks';
import type { JourneySegment, TransportOption } from '../../services/tripPlannerService';

interface TransportationStepProps {
  request: TripPlanningRequest;
  selectedTransportation: string[];
  onToggleTransportation: (transportationId: string) => void;
  onRefreshAI: () => void;
  isLoading: boolean;
}


export default function TransportationStep({
  request,
  selectedTransportation,
    onToggleTransportation,
  onRefreshAI,
  isLoading
}: TransportationStepProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'convenience'>('price');
  const [selectedTransportItem, setSelectedTransportItem] = useState<TransportOption | null>(null);

  const { 
    journeySegments, 
    isLoading: segmentsLoading, 
    isError: segmentsError, 
    refetch: refetchSegments 
  } = useJourneySegments(request);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Transportation</h2>
      </div>

      <div className="space-y-6">

        {/* Journey Overview */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Complete Journey Plan</h3>
          <p className="text-sm text-blue-700">Select transportation for each segment of your trip</p>
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
              <option value="price">Price</option>
              <option value="duration">Duration</option>
              <option value="convenience">Convenience</option>
            </select>
          </div>
          
          <button
            onClick={() => {
              onRefreshAI();
              refetchSegments();
            }}
            disabled={isLoading || segmentsLoading}
            className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {(isLoading || segmentsLoading) ? 'Loading...' : 'Refresh AI'}
          </button>
        </div>

        {/* Journey Segments */}
        <div className="space-y-8">
          {segmentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-blue-600">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium">Loading journey segments...</span>
              </div>
            </div>
          ) : segmentsError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-sm font-medium">Failed to load journey segments</p>
                <p className="text-xs text-gray-500 mt-1">Please try clicking the refresh button</p>
              </div>
              <button
                onClick={() => refetchSegments()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            journeySegments.map((segment) => (
              <JourneySegment
                key={segment.id}
                segment={segment}
                request={request}
                selectedTransportation={selectedTransportation}
                onToggleTransportation={onToggleTransportation}
                onInfoClick={setSelectedTransportItem}
                isLoading={isLoading}
              />
            ))
          )}
        </div>
        </div>

      {/* Transport Info Modal */}
      {selectedTransportItem && (
        <TransportModal
          transport={selectedTransportItem}
          onClose={() => setSelectedTransportItem(null)}
        />
      )}
    </div>
  );
}

interface JourneySegmentProps {
  segment: JourneySegment;
  request: TripPlanningRequest;
  selectedTransportation: string[];
  onToggleTransportation: (id: string) => void;
  onInfoClick: (transport: TransportOption) => void;
  isLoading: boolean;
}

function JourneySegment({ segment, request, selectedTransportation, onToggleTransportation, onInfoClick, isLoading }: JourneySegmentProps) {
  // Use custom hook for transport options with React Query
  const { 
    transportOptions, 
    isLoading: optionsLoading, 
    isError: optionsError, 
    refetch: refetchOptions 
  } = useTransportOptions(request, segment.id);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="mb-4">
        <div className="flex items-start gap-4">
          <div 
            className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${segment.image})` }}
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{segment.title}</h3>
            <div className="text-sm text-blue-600 font-medium mb-1">{segment.route}</div>
            <div className="text-sm text-gray-600">{segment.description}</div>
          </div>
        </div>
      </div>
          
      <div className="relative">
        {(isLoading || optionsLoading) && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600">
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium">Loading {segment.title.toLowerCase()} options...</span>
              </div>
          </div>
        )}
        
        {optionsError ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-sm font-medium">Failed to load transport options</p>
            </div>
            <button
              onClick={() => refetchOptions()}
              className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {transportOptions.map((option) => (
              <TransportCard
                key={option.id}
                transport={option}
                isSelected={selectedTransportation.includes(option.id)}
                onToggle={() => onToggleTransportation(option.id)}
                onInfoClick={() => onInfoClick(option)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TransportCardProps {
  transport: TransportOption;
  isSelected: boolean;
  onToggle: () => void;
  onInfoClick: () => void;
}

function TransportCard({ transport, isSelected, onToggle, onInfoClick }: TransportCardProps) {
  return (
    <div className="flex-shrink-0 w-44 bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-28">
        <div 
          className="absolute inset-0 bg-cover bg-center" 
          style={{ backgroundImage: `url(${transport.image})` }}
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
          className="absolute top-2 left-2 w-8 h-8 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center text-white text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
          </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-2">{transport.name}</h3>
        <div className="text-sm text-gray-600 mb-2">{transport.description}</div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-green-600 font-semibold">${transport.price}</span>
          <span className="text-gray-500">{transport.duration}</span>
        </div>
        
        {transport.details?.airline && (
          <div className="text-xs text-gray-500 mt-1">{transport.details.airline}</div>
        )}
        {transport.details?.company && (
          <div className="text-xs text-gray-500 mt-1">{transport.details.company}</div>
        )}
      </div>
        </div>
  );
}

interface TransportModalProps {
  transport: TransportOption;
  onClose: () => void;
}

function TransportModal({ transport, onClose }: TransportModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Main Image */}
          <div 
            className="h-64 bg-cover bg-center" 
            style={{ backgroundImage: `url(${transport.image})` }}
          />
          
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{transport.name}</h2>
                <div className="text-lg text-green-600 font-semibold">${transport.price}</div>
                <div className="text-gray-600">{transport.duration}</div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Description */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{transport.description}</p>
            </div>
            
            {/* Details */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Details</h3>
              <div className="space-y-2">
                {transport.details?.airline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Airline:</span>
                    <span className="font-medium">{transport.details.airline}</span>
                  </div>
                )}
                {transport.details?.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Company:</span>
                    <span className="font-medium">{transport.details.company}</span>
                  </div>
                )}
                {transport.details?.vehicle && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-medium">{transport.details.vehicle}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Images */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">More Images</h3>
              <div className="grid grid-cols-2 gap-2">
                <div 
                  className="h-24 bg-cover bg-center rounded"
                  style={{ backgroundImage: `url(${transport.image})` }}
                />
                <div 
                  className="h-24 bg-cover bg-center rounded"
                  style={{ backgroundImage: `url(${transport.image})` }}
                />
              </div>
            </div>
            
            {/* Inclusions */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What's Included</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Professional service</li>
                <li>• 24/7 customer support</li>
                <li>• Flexible booking options</li>
                <li>• Best price guarantee</li>
              </ul>
            </div>
            
            {/* Notes */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Important Notes</h3>
              <div className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
                <p>• Prices may vary based on season and availability</p>
                <p>• Cancellation policies apply</p>
                <p>• Additional fees may apply for special requests</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Select This Option
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
