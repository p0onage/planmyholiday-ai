import React from "react";
import { TripDetailModalProps } from "../types";

export default function TripDetailModal({ trip, onClose }: TripDetailModalProps) {
  if (!trip) return null;
  
  const handleClose = (): void => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={handleClose}
        >
          &times;
        </button>
        <img src={trip.image} alt={trip.name} className="w-full h-48 object-cover rounded-xl mb-4" />
        <h2 className="text-2xl font-bold mb-2">{trip.name}</h2>
        <div className="text-gray-500 mb-2">{trip.location}</div>
        <div className="flex gap-2 mb-4">
          {trip.types.map(type => (
            <span key={type} className="bg-blue-100 text-accent px-2 py-1 rounded-full text-xs">
              {type}
            </span>
          ))}
        </div>
        <div className="mb-4">
          <strong>Activities:</strong> {trip.activities.join(", ")}
        </div>
        <div className="mb-4">
          <strong>Budget:</strong> {trip.budget}
        </div>
        <div className="mb-4">
          <strong>Itinerary Example:</strong>
          <ul className="list-disc ml-6">
            {trip.itinerary.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="flex gap-4">
          <button className="bg-accent text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-blue-700 transition">
            Book Now
          </button>
          <button className="bg-gray-100 text-accent px-4 py-2 rounded-full font-semibold shadow hover:bg-gray-200 transition">
            Save Trip
          </button>
        </div>
      </div>
    </div>
  );
}
