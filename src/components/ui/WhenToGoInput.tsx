import { useFormContext } from "react-hook-form";
import { type TripPlannerFormValues } from "../../types";
import type {  FormInputProps } from "./types";

// 1. When To Go
export function WhenToGoInput({ layout }: FormInputProps = {}) {
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
