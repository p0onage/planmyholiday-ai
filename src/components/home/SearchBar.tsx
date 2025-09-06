import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TripPlannerForm from "../ui/TripPlannerForm";
import FormLayout, {type FormLayoutConfig } from "../ui/FormLayout";
import { type TripPlannerFormValues } from "../../types";
import { useFormContext } from "react-hook-form";
import { useLocation } from "../../providers/LocationProvider";

// Search input component that can access form context
function SearchInput() {
    const { register } = useFormContext<TripPlannerFormValues>();

    return (
        <div className="flex-1 px-6 py-4">
            <input
                type="text"
                placeholder="Plan your holiday..."
                className="w-full bg-transparent text-lg placeholder-gray-500 focus:outline-none"
                {...register("query")}
            />
        </div>
    );
}

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
            departureCity: "",
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

export default function SearchBar() {
    const [isDesktopModalOpen, setDesktopModalOpen] = useState(false);
    const [isDesktopModalClosing, setIsDesktopModalClosing] = useState(false);
    const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const [isMobileDrawerClosing, setIsMobileDrawerClosing] = useState(false);
    const navigate = useNavigate();
    
    // Get user location for default departure city
    const { location } = useLocation();

    // Handle desktop modal closing animation
    const handleDesktopModalClose = () => {
        setIsDesktopModalClosing(true);
        setTimeout(() => {
            setDesktopModalOpen(false);
            setIsDesktopModalClosing(false);
        }, 300); // Match animation duration
    };

    // Handle mobile drawer closing animation
    const handleMobileDrawerClose = () => {
        setIsMobileDrawerClosing(true);
        setTimeout(() => {
            setMobileDrawerOpen(false);
            setIsMobileDrawerClosing(false);
        }, 300); // Match animation duration
    };

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (isMobileDrawerOpen && !isMobileDrawerClosing) {
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            // Prevent touch scrolling on mobile
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            // Restore body scroll
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isMobileDrawerOpen, isMobileDrawerClosing]);

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
        departureCity: location?.city || "",
    };

    const singleColumnConfig : FormLayoutConfig  = {
        whenToGo: { fullWidth: true },
        departureCity: { fullWidth: true },
        duration: { fullWidth: true },
        budget: { fullWidth: true },
        groupSize: { fullWidth: true },
    };

    const onSubmit = (data: TripPlannerFormValues) => {
        
        // Navigate to planning page with search data
        navigate('/plan', { 
            state: { 
                searchData: data
            } 
        });
        
        handleDesktopModalClose();
        handleMobileDrawerClose();
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            {/* Desktop Search Bar */}
            <div className="hidden md:block">
                <TripPlannerForm defaultValues={defaultValues} onSubmit={onSubmit}>
                    <div className="flex items-center bg-gray-100 rounded-full overflow-hidden w-4/6 mx-auto">
                        {/* Search Input */}
                        <SearchInput />
                        
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
                            className="px-6 py-4 bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                        >
                            <span className="text-lg">🔍</span>
                        </button>
                    </div>
                </TripPlannerForm>
            </div>

            {/* Desktop Modal - Slides down from search bar */}
            {(isDesktopModalOpen || isDesktopModalClosing) && (
                <div className="hidden md:block relative">
                    {/* Backdrop - covers entire screen */}
                    <div 
                        className="fixed inset-0 z-40"
                        onClick={handleDesktopModalClose}
                    />
                    
                    {/* Modal content - positioned below search bar */}
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white shadow-lg border border-gray-200 rounded-lg z-50 max-h-[80vh] overflow-y-auto ${
                        isDesktopModalClosing ? 'animate-slide-up-to-top' : 'animate-slide-down-from-top'
                    }`}>
                        <div className="max-w-3xl mx-auto p-4">
                            <TripPlannerForm defaultValues={defaultValues} onSubmit={onSubmit}>
                                <ModalControls onClose={handleDesktopModalClose} />
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
            {(isMobileDrawerOpen || isMobileDrawerClosing) && (
                <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-end overflow-hidden">
                    {/* Backdrop - click to close */}
                    <div 
                        className="absolute inset-0"
                        onClick={handleMobileDrawerClose}
                    />
                    
                    {/* Drawer content */}
                    <div className={`w-full h-[85vh] bg-white rounded-t-xl relative z-10 flex flex-col ${
                        isMobileDrawerClosing ? 'animate-slide-down' : 'animate-slide-up'
                    }`}>
                        <TripPlannerForm defaultValues={defaultValues} onSubmit={onSubmit}>
                            <div className="flex flex-col h-full">
                                {/* Scrollable content area */}
                                <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(85vh - 80px)' }}>
                                    {/* Query Input - Mobile */}
                                    <div className="mb-6">
                                        <label className="text-sm font-semibold text-gray-700 block mb-3">
                                            describe the holiday you want
                                        </label>
                                        <SearchInput />
                                    </div>
                                    
                                    <FormLayout config={singleColumnConfig} />
                                    
                                    {/* Bottom spacing for fixed controls */}
                                    <div className="h-20"></div>
                                </div>

                                {/* Fixed bottom controls */}
                                <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 rounded-b-xl">
                                    <div className="flex justify-between items-center">
                                        <button type="reset" className="underline text-gray-600 hover:text-gray-800 transition-colors">
                                            Clear all
                                        </button>
                                        <button type="submit" className="bg-primary-500 p-3 rounded-full text-white hover:bg-primary-600 transition-colors shadow-lg">
                                            🔍
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </TripPlannerForm>
                    </div>
                </div>
            )}
        </div>
    );
}