import React from "react";

const StatCard = ({
  label,
  value,
  change,
  changeType = "positive",
  icon,
  gradient = "from-neon-green to-neon-blue",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
                glass-card p-4 sm:p-6 
                hover:border-neon-green/30 
                hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] 
                transition-all duration-300 
                group
                ${onClick ? "cursor-pointer" : ""}
            `}
    >
      <div className="flex items-start justify-between">
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
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
        {change && (
          <div
            className={`
                        flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium
                        ${
                          changeType === "positive"
                            ? "bg-neon-green/10 text-neon-green"
                            : "bg-red-500/10 text-red-400"
                        }
                    `}
          >
            <svg
              className={`w-3 h-3 ${changeType === "positive" ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            {change}
          </div>
        )}
      </div>

      <div className="mt-4">
        <p className="text-gray-400 text-xs sm:text-sm truncate">{label}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white mt-1 group-hover:text-neon-green transition-colors truncate">
          {value}
        </p>
      </div>

      <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
          style={{ width: "70%" }}
        />
      </div>
    </div>
  );
};

export default StatCard;
