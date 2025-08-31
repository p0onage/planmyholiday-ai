const tabs = ["Journey", "Location", "Family", "Weekender"];

export default function Tabs({ active, onChange }) {
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
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
}
