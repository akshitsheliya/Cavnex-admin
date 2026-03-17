// src/components/common/FilterBar.jsx
import React, { useState, useRef, useEffect } from "react";

const SearchIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ChevronDownIcon = () => (
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
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ResetIcon = () => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

const CalendarIcon = () => (
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
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const FilterIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative min-w-[160px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${
          isOpen
            ? "bg-white/[0.08] border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
            : value
              ? "bg-neon-green/[0.08] border-neon-green/30 text-neon-green"
              : "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:border-white/20"
        }`}
      >
        <span className={value ? "text-neon-green" : "text-gray-400"}>
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDownIcon />
      </button>

      <div
        className={`absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 origin-top ${
          isOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-95 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-h-[280px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent py-1">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between ${
                value === option.value
                  ? "bg-neon-green/10 text-neon-green"
                  : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <svg
                  className="w-4 h-4 text-neon-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DateInput = ({ value, onChange, placeholder }) => {
  return (
    <div className="relative min-w-[160px]">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        <CalendarIcon />
      </div>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all duration-300 [color-scheme:dark]"
      />
    </div>
  );
};

const FilterBar = ({
  searchPlaceholder = "Search...",
  filters,
  onFilterChange,
  onReset,
  filterConfig = [],
}) => {
  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== "sortBy" && key !== "sortOrder" && value
  );

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => key !== "sortBy" && key !== "sortOrder" && value
  ).length;

  return (
    <div className="relative mb-6">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon-green/[0.03] via-transparent to-neon-blue/[0.03] pointer-events-none" />
      <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-4">
        <div className="flex items-center gap-2 mb-4">
          <FilterIcon />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold animate-pulse">
              {activeFilterCount} active
            </span>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-green transition-colors duration-300">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.search || ""}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] transition-all duration-300"
            />
            {filters.search && (
              <button
                onClick={() => onFilterChange("search", "")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {filterConfig.map((config) => {
            if (config.type === "select") {
              return (
                <CustomSelect
                  key={config.key}
                  value={filters[config.key] || ""}
                  onChange={(val) => onFilterChange(config.key, val)}
                  options={config.options}
                  placeholder={config.placeholder}
                />
              );
            }
            if (config.type === "date") {
              return (
                <DateInput
                  key={config.key}
                  value={filters[config.key] || ""}
                  onChange={(val) => onFilterChange(config.key, val)}
                  placeholder={config.placeholder}
                />
              );
            }
            return null;
          })}

          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              hasActiveFilters
                ? "bg-white/[0.06] border border-white/10 text-gray-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 active:scale-95"
                : "bg-white/[0.02] border border-white/[0.05] text-gray-600 cursor-not-allowed"
            }`}
          >
            <ResetIcon />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
