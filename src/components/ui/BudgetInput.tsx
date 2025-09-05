import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import { useLocation } from "../../providers/LocationProvider";
import type {  FormInputProps } from "./types";

// 3. Budget
export function BudgetInput({ layout }: FormInputProps = {}) {
    const { register } = useFormContext<TripPlannerFormValues>();
    const { currency } = useLocation();

    const containerClasses = layout?.fullWidth 
        ? "space-y-3 h-full" 
        : `space-y-3 h-full ${layout?.span === 2 ? 'col-span-2' : ''}`;

    return (
        <div className={containerClasses}>
            <label className="text-sm font-semibold text-gray-700 block">
                Budget (per person)
            </label>
            
            <div className="min-h-[80px] flex items-start">
                <div className="relative w-full">
                    {/* Currency icon */}
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                        {currency?.symbol}
                    </div>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Enter budget amount"
                        {...register("budget", { 
                            valueAsNumber: true,
                            min: 0
                        })}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    />
                </div>
            </div>
        </div>
    );
}
