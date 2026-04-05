import React from "react";

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

const DateInput = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  size = "md",
  min,
  max,
}) => {
  const sizeClasses = {
    sm: "pl-9 pr-3 py-2 text-xs",
    md: "pl-10 pr-4 py-3 text-sm",
    lg: "pl-12 pr-5 py-4 text-base",
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        <CalendarIcon />
      </div>
      <input
        type="date"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-neon-green/50 focus:bg-white/[0.06] focus:shadow-[0_0_15px_rgba(57,255,20,0.1)] transition-all duration-300 [color-scheme:dark] ${sizeClasses[size]}`}
      />
    </div>
  );
};

export default DateInput;
