// src/components/common/StatCards.jsx
import React from "react";

const StatCards = ({ stats = [] }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-2 gap-4 mb-6 ${stats.length <= 4 ? `md:grid-cols-${stats.length}` : "md:grid-cols-4 lg:grid-cols-5"}`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.12] transition-all duration-500 overflow-hidden"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500`}
          />
          <div className="relative flex items-center gap-4">
            {stat.icon && (
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d={stat.icon}
                  />
                </svg>
              </div>
            )}
            <div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                {stat.label}
              </p>
              <p
                className={`text-xl font-bold mt-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
