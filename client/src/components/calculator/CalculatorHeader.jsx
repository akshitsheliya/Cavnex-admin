import React from "react";

const CalculatorHeader = ({ selectedCount, onClearAll }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            Project Pricing Calculator
          </h1>
          <p className="text-gray-400 mt-2">
            Select features to build your custom package and get instant pricing
          </p>
        </div>

        <div className="flex items-center gap-4">
          {selectedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-green/10 border border-neon-green/30">
              <span className="text-neon-green font-semibold">
                {selectedCount}
              </span>
              <span className="text-gray-400">features selected</span>
            </div>
          )}

          {selectedCount > 0 && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 transition-all"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Gradient line */}
      <div className="mt-6 h-px bg-gradient-to-r from-neon-green via-neon-blue to-transparent" />
    </div>
  );
};

export default CalculatorHeader;
