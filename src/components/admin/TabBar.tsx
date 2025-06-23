import React from "react";

interface TabBarProps {
  value: "news" | "events";
  onChange: (tab: "news" | "events") => void;
}

export const TabBar: React.FC<TabBarProps> = ({ value, onChange }) => {
  const tabs = [
    { id: "news" as const, label: "News Articles" },
    { id: "events" as const, label: "Events" },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
              value === tab.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};
