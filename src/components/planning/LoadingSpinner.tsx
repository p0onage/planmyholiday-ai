interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = "Planning your trip..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">✈️</span>
          </div>
        </div>
        
        {/* Loading message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{message}</h2>
        <p className="text-gray-600 mb-4">Our AI is crafting the perfect itinerary for you</p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}
