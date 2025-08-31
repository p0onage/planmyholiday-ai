import TripCard from "./TripCard";
import { type TripGridProps } from "../types";

export default function TripGrid({ trips, onView }: TripGridProps) {
  return (
    <section className="px-4 py-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} onView={onView} />
      ))}
    </section>
  );
}
