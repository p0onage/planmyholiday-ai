import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import type {  FormInputProps } from "./types";

// 2. Trip Duration
export function DurationInput({ layout }: FormInputProps = {}) {
    const { register } = useFormContext<TripPlannerFormValues>();

    const containerClasses = layout?.fullWidth 
        ? "space-y-3 h-full" 
        : `space-y-3 h-full ${layout?.span === 2 ? 'col-span-2' : ''}`;

    return (
        <div className={containerClasses}>
            <label className="text-sm font-semibold text-gray-700 block">
                Trip Duration
            </label>
            
            <div className="min-h-[80px] flex items-start">
                <div className="flex gap-2 w-full">
                    <input
                        type="number"
                        min="1"
                        max="999"
                        {...register("durationValue", { 
                            valueAsNumber: true,
                            min: 1,
                            max: 999
                        })}
                        className="w-20 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                    <select
                        {...register("durationUnit")}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="months">Months</option>
                        <option value="years">Years</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
