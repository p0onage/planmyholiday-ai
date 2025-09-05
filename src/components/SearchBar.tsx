import { useState } from "react";
import TripPlannerForm from "./ui/TripPlannerForm";
import FormLayout, { singleColumnConfig } from "./ui/FormLayout";
import { type TripPlannerFormValues } from "../types";
import { useFormContext } from "react-hook-form";

// Modal controls component that can access form context
function ModalControls({ onClose }: { onClose: () => void }) {
    const { reset } = useFormContext<TripPlannerFormValues>();
    
    const handleClearAll = () => {
        reset({
            query: "",
            when: "flexible",
            flexibleText: "",
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            exactDates: { start: "", end: "" },
            durationValue: 7,
            durationUnit: "days",
            budget: 0,
            adults: 1,
            kids: 0,
        });
    };

    return (
        <div className="flex justify-end gap-3 mb-4">
            <button 
                type="button"
                onClick={handleClearAll}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
                <span>🗑️</span>
                Clear all
            </button>
            <button 
                type="button"
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
                <span>✕</span>
                Close
            </button>
        </div>
    );
}

export default function 
() {
    const [isDesktopModalOpen, setDesktopModalOpen] = useState(false);
    const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const defaultValues: TripPlannerFormValues = {
        query: "",
        when: "flexible",
        flexibleText: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        exactDates: { start: "", end: "" },
        durationValue: 7,
        durationUnit: "days",
        budget: 0,
        adults: 1,
        kids: 0,
    };

    const onSubmit = (data: TripPlannerFormValues) => {
        console.log("Form submitted:", data);
        setDesktopModalOpen(false);
        setMobileDrawerOpen(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Desktop Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full overflow-hidden w-4/6 mx-auto">
                {/* Search Input */}
                <div className="flex-1 px-6 py-4">
                    <input
                        type="text"
                        placeholder="Plan your holiday..."
                        className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
                        name="query"
                    />
                </div>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-300"></div>
                
                {/* Filter Button */}
                <button
                    type="button"
                    className="px-6 py-4 hover:bg-gray-200 transition-colors"
                    onClick={() => setDesktopModalOpen(!isDesktopModalOpen)}
                >
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Filters</span>
                        <span className="text-lg">⚙️</span>
                    </div>
                </button>
                
                {/* Separator */}
                <div className="w-px h-8 bg-gray-300"></div>
                
                {/* Search Button */}
                <button 
                    type="submit" 
                    className="px-6 py-4 bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                    <span className="text-lg">🔍</span>
                </button>
            </div>

            {/* Desktop Modal - Slides down from search bar */}
            {isDesktopModalOpen && (
                <div className="hidden md:block relative">
                    {/* Backdrop - covers entire screen */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setDesktopModalOpen(false)}
                    />
                    
                    {/* Modal content - positioned below search bar */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg animate-slide-down z-50 max-h-[80vh] overflow-y-auto">
                        <div className="max-w-3xl mx-auto p-4">
                            <TripPlannerForm defaultValues={defaultValues} onSubmit={onSubmit}>
                                <ModalControls onClose={() => setDesktopModalOpen(false)} />
                                <FormLayout />
                            </TripPlannerForm>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Search Bar */}
            <div className="md:hidden">
                <input
                    type="text"
                    placeholder="Start planning your holiday...."
                    className="w-full px-4 py-3 border rounded-full focus:outline-none"
                    readOnly
                    onClick={() => setMobileDrawerOpen(true)}
                />
            </div>

            {/* Mobile Bottom Drawer */}
            {isMobileDrawerOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end">
                    {/* Backdrop - click to close */}
                    <div 
                        className="absolute inset-0"
                        onClick={() => setMobileDrawerOpen(false)}
                    />
                    
                    {/* Drawer content */}
                    <div className="w-full max-h-[80%] bg-white rounded-t-xl relative z-10 animate-slide-up flex flex-col">
                        {/* Scrollable content area */}
                        <div className="flex-1 overflow-y-auto p-4 pb-20">
                            <TripPlannerForm defaultValues={defaultValues} onSubmit={onSubmit}>
                                <FormLayout config={singleColumnConfig} />
                            </TripPlannerForm>
                        </div>

                        {/* Fixed bottom controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 rounded-b-xl">
                            <div className="flex justify-between items-center">
                                <button type="reset" className="underline text-gray-600">
                                    Clear all
                                </button>
                                <button type="submit" className="bg-accent p-3 rounded-full text-white hover:bg-accent/90 transition-colors">
                                    🔍
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}