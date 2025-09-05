import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import type { FormInputLayout, FormInputProps } from "./types";

// 4. Group Size
export function GroupSizeInput({ layout }: FormInputProps = {}) {
    const { register } = useFormContext<TripPlannerFormValues>();

    const containerClasses = layout?.fullWidth 
        ? "space-y-3 h-full" 
        : `space-y-3 h-full ${layout?.span === 2 ? 'col-span-2' : ''}`;

    return (
        <div className={containerClasses}>
            <label className="text-sm font-semibold text-gray-700 block">
                Group Size
            </label>
            
            <div className="min-h-[80px] flex items-start">
                <div className="grid grid-cols-2 gap-3 w-full">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Adults</label>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            placeholder="1"
                            {...register("adults", { 
                                valueAsNumber: true,
                                min: 1
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Kids</label>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            {...register("kids", { 
                                valueAsNumber: true,
                                min: 0
                            })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
