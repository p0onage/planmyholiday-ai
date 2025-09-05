import { type TripCardProps } from "../../types";

export default function TripCard({ trip, onView }: TripCardProps) {
  const handleViewClick = (): void => {
    onView(trip);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <img src={trip.image} alt={trip.name} className="h-40 w-full object-cover" />
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">{trip.name}</h2>
          <span className="bg-primary-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
            {trip.rating}
          </span>
        </div>
        <div className="text-gray-500 text-sm mb-2">{trip.location}</div>
        <div className="flex gap-2 mb-4">
          {trip.types.map(type => (
            <span key={type} className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs">
              {type}
            </span>
          ))}
        </div>
        <button
          className="mt-auto text-primary-500 font-semibold hover:underline"
          onClick={handleViewClick}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
