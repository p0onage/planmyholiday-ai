import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../types";
import { useCurrency } from "../contexts/CurrencyContext";

// Layout configuration types
export interface FormInputLayout {
  span?: 1 | 2; // How many columns this input should span (1 or 2)
  fullWidth?: boolean; // Whether to take full width regardless of grid
}

export interface FormInputProps {
  layout?: FormInputLayout;
}

// 1. When To Go
export function WhenToGo({ layout }: FormInputProps = {}) {
    const { register, setValue, watch } = useFormContext<TripPlannerFormValues>();
    const whenValue = watch("when");

    const handleWhenChange = (value: "flexible" | "month" | "exact") => {
        setValue("when", value);
    };

    const containerClasses = layout?.fullWidth 
        ? "space-y-3 h-full" 
        : `space-y-3 h-full ${layout?.span === 2 ? 'col-span-2' : ''}`;

    return (
        <div className={containerClasses}>
            <label className="text-sm font-semibold text-gray-700 block">
                When do you want to go?
            </label>
            
            {/* Radio buttons */}
            <div className="flex flex-wrap gap-2">
                {[
                    { value: "flexible", label: "Flexible" },
                    { value: "month", label: "By Month" },
                    { value: "exact", label: "Exact Dates" }
                ].map((option) => (
                    <label key={option.value} className="cursor-pointer">
                        <input
                            type="radio"
                            value={option.value}
                            {...register("when")}
                            className="sr-only"
                        />
                        <div
                            onClick={() => handleWhenChange(option.value as any)}
                            className={`px-3 py-2 text-sm rounded-full border-2 transition-all duration-200 ${
                                whenValue === option.value
                                    ? "bg-accent text-white border-accent shadow-sm"
                                    : "bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
                            }`}
                        >
                            {option.label}
                        </div>
                    </label>
                ))}
            </div>
            
            {/* Conditional content with fixed height container */}
            <div className="min-h-[80px] flex items-start">
                {whenValue === "exact" && (
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                            <input
                                type="date"
                                {...register("exactDates.start")}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">End Date</label>
                            <input
                                type="date"
                                {...register("exactDates.end")}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                        </div>
                    </div>
                )}
                
                {whenValue === "month" && (
                    <div className="grid grid-cols-2 gap-3 w-full">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Month</label>
                            <select
                                {...register("month", { valueAsNumber: true })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = i + 1;
                                    const monthName = new Date(2024, i).toLocaleDateString('en', { month: 'long' });
                                    return (
                                        <option key={month} value={month}>{monthName}</option>
                                    );
                                })}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">Year</label>
                            <select
                                {...register("year", { valueAsNumber: true })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                                {Array.from({ length: 3 }, (_, i) => {
                                    const year = new Date().getFullYear() + i;
                                    return (
                                        <option key={year} value={year}>{year}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                )}
                
                {whenValue === "flexible" && (
                    <div className="w-full">
                        <label className="block text-xs text-gray-600 mb-1">Preferred time (optional)</label>
                        <input
                            type="text"
                            placeholder="e.g., Spring, Summer holidays, etc."
                            {...register("flexibleText")}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

// 2. Trip Duration
export function DurationPicker({ layout }: FormInputProps = {}) {
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

// 3. Budget
export function BudgetInput({ layout }: FormInputProps = {}) {
    const { register } = useFormContext<TripPlannerFormValues>();
    const { currency } = useCurrency();

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
                        {currency.symbol}
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