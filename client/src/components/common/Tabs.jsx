import React, { useState } from "react";

const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  variant = "default",
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variants = {
    default: {
      container: "border-b border-white/10",
      tab: "pb-3 px-1 text-sm font-medium transition-colors",
      active: "text-neon-green border-b-2 border-neon-green",
      inactive: "text-gray-400 hover:text-white",
    },
    pills: {
      container: "p-1 bg-white/5 rounded-xl",
      tab: "px-4 py-2 text-sm font-medium rounded-lg transition-all",
      active: "bg-neon-green text-black",
      inactive: "text-gray-400 hover:text-white hover:bg-white/5",
    },
    buttons: {
      container: "flex gap-2",
      tab: "px-4 py-2 text-sm font-medium rounded-xl transition-all border",
      active: "bg-white/10 border-white/20 text-white",
      inactive:
        "border-transparent text-gray-400 hover:text-white hover:bg-white/5",
    },
  };

  const style = variants[variant];

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex gap-4 ${style.container}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={`
                            ${style.tab}
                            ${activeTab === tab.id ? style.active : style.inactive}
                            ${tab.disabled ? "opacity-50 cursor-not-allowed" : ""}
                        `}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <span>{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-white/10">
                  {tab.badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
