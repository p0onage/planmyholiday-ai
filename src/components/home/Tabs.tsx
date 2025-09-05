import {useState} from "react";
import {TravelCategory, type TravelTabProps} from "../../types";

const Tabs = ({ activeTab = TravelCategory.Journey, onTabChange }: TravelTabProps) => {
    const [active, setActive] = useState<TravelCategory>(activeTab);

    const handleTabClick = (tab: TravelCategory) => {
        setActive(tab);
        onTabChange?.(tab);
    };

    return (
        <nav className="flex justify-center items-center mb-8 mt-5">
            <div className="flex space-x-2">
                {Object.values(TravelCategory).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabClick(tab)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                            active === tab
                                ? 'bg-primary-500 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Tabs;