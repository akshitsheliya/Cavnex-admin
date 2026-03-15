import React, { useState } from "react";

const FeatureCard = ({ feature, isSelected, onToggle }) => {
  const [showDetails, setShowDetails] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className={`
                relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
                ${
                  isSelected
                    ? "bg-gradient-to-br from-neon-green/10 to-neon-blue/10 border-neon-green/50 shadow-[0_0_30px_rgba(0,255,136,0.15)]"
                    : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                }
            `}
      onClick={() => onToggle(feature.id)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-20px] w-[80px] bg-neon-green text-black text-xs font-bold py-1 text-center transform rotate-45">
            ✓
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                        ${isSelected ? "bg-neon-green/20" : "bg-white/5"}
                    `}
          >
            {feature.icon}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-lg ${isSelected ? "text-neon-green" : "text-white"}`}
            >
              {feature.name}
            </h3>
            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
              {feature.description}
            </p>
          </div>

          {/* Checkbox */}
          <div
            className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0
                        ${
                          isSelected
                            ? "bg-neon-green border-neon-green"
                            : "border-white/20 hover:border-white/40"
                        }
                    `}
          >
            {isSelected && (
              <svg
                className="w-4 h-4 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Price & Days */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            <span
              className={`text-xl font-bold ${isSelected ? "text-neon-green" : "text-white"}`}
            >
              {formatCurrency(feature.price)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{feature.estimatedDays} days</span>
          </div>
        </div>

        {/* Expandable details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDetails(!showDetails);
          }}
          className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
        >
          {showDetails ? "Hide" : "Show"} details
          <svg
            className={`w-4 h-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Details panel */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <p className="text-xs text-gray-500 mb-2">Includes:</p>
            <div className="grid grid-cols-2 gap-2">
              {feature.includes.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureCard;
