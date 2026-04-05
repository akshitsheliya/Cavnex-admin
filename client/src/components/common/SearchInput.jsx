import React from "react";

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

const CloseIcon = () => (
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
);

const SearchInput = ({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "pl-10 pr-8 py-2 text-xs",
    md: "pl-12 pr-10 py-3 text-sm",
    lg: "pl-14 pr-12 py-4 text-base",
  };

  const iconSizeClasses = {
    sm: "left-3",
    md: "left-4",
    lg: "left-5",
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`relative group ${className}`}>
      <div
        className={`absolute ${iconSizeClasses[size]} top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-green transition-colors duration-300`}
      >
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.06] focus:shadow-[0_0_20px_rgba(57,255,20,0.08)] transition-all duration-300 ${sizeClasses[size]}`}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
