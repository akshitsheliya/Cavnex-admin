import React, { useState, useRef, useEffect } from "react";

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
  </svg>
);

const Dropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select...",
  size = "md",
  variant = "default",
  disabled = false,
  className = "",
  dropdownClassName = "",
  showCheckmark = true,
  icon = null,
}) => {
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

  const sizeClasses = {
    sm: "px-3 py-2 text-xs",
    md: "px-4 py-3 text-sm",
    lg: "px-5 py-4 text-base",
  };

  const variantClasses = {
    default: {
      base: "bg-white/[0.03] border-white/10 text-gray-400 hover:bg-white/[0.06] hover:border-white/20",
      active: "bg-neon-green/[0.08] border-neon-green/30 text-neon-green",
      open: "bg-white/[0.08] border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.1)]",
    },
    minimal: {
      base: "bg-white/5 border-white/10 text-white hover:bg-white/10",
      active: "bg-white/10 border-white/20 text-white",
      open: "bg-white/10 border-neon-green/50",
    },
    ghost: {
      base: "bg-transparent border-transparent text-gray-400 hover:text-white",
      active: "bg-transparent border-transparent text-neon-green",
      open: "bg-white/5 border-white/10",
    },
  };

  const getButtonClasses = () => {
    const v = variantClasses[variant] || variantClasses.default;
    if (isOpen) return v.open;
    if (value) return v.active;
    return v.base;
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 rounded-xl border font-medium transition-all duration-300 ${sizeClasses[size]} ${getButtonClasses()} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className={value ? (variant === "minimal" ? "text-white" : "text-neon-green") : "text-gray-400"}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDownIcon />
        </div>
      </button>

      <div
        className={`absolute z-50 top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#1a1a2e]/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 origin-top ${dropdownClassName} ${
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
              disabled={option.disabled}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-200 flex items-center justify-between ${
                option.disabled
                  ? "text-gray-600 cursor-not-allowed"
                  : value === option.value
                    ? "bg-neon-green/10 text-neon-green"
                    : "text-gray-300 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {option.icon && <span>{option.icon}</span>}
                <span>{option.label}</span>
              </div>
              {showCheckmark && value === option.value && <CheckIcon />}
            </button>
          ))}
          {options.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">No options available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;