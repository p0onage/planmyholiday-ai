import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import type { FormInputProps } from "./types";

// Departure City Input
export function DepartureCityInput({ layout }: FormInputProps = {}) {
    const { register } = useFormContext<TripPlannerFormValues>();

    const containerClasses = layout?.fullWidth 
        ? "space-y-3 h-full" 
        : `space-y-3 h-full ${layout?.span === 2 ? 'col-span-2' : ''}`;

    return (
        <div className={containerClasses}>
            <label className="text-sm font-semibold text-gray-700 block">
                Departure City
            </label>
            
            <div className="min-h-[80px] flex items-start">
                <input
                    type="text"
                    placeholder="Enter your departure city"
                    {...register("departureCity")}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                />
            </div>
        </div>
    );
}
