import React from "react";

const StatCard = ({
  label,
  value,
  change,
  changeType = "positive",
  icon,
  gradient,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="glass-card p-6 cursor-pointer hover:border-neon-green/30 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d={icon}
            />
          </svg>
        </div>
        <div
          className={`px-2 py-1 rounded-lg text-xs font-medium ${
            changeType === "positive"
              ? "bg-neon-green/10 text-neon-green"
              : changeType === "negative"
                ? "bg-red-500/10 text-red-400"
                : "bg-gray-500/10 text-gray-400"
          }`}
        >
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white mt-1 group-hover:text-neon-green transition-colors">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
