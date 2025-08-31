import { type TabsProps } from "../types";

const tabs: string[] = ["Journey", "Location", "Family", "Weekender"];

export default function Tabs({ active, onChange }: TabsProps) {
  const handleTabClick = (tab: string): void => {
    onChange(tab);
  };

  return (
    <nav className="flex gap-4 mt-4 mb-8">
      {tabs.map(tab => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full font-medium transition ${
            active === tab
              ? "bg-accent text-white shadow"
              : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
