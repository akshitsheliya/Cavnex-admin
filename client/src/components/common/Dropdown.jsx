import React, { useState, useRef, useEffect } from "react";

const Dropdown = ({
  trigger,
  children,
  position = "bottom-right",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const positions = {
    "bottom-left": "top-full left-0 mt-2",
    "bottom-right": "top-full right-0 mt-2",
    "top-left": "bottom-full left-0 mb-2",
    "top-right": "bottom-full right-0 mb-2",
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
                        absolute ${positions[position]} z-50
                        min-w-[200px] py-2
                        bg-gray-900 border border-white/10 rounded-xl
                        shadow-xl shadow-black/50
                        animate-fadeIn
                    `}
        >
          {typeof children === "function"
            ? children({ close: () => setIsOpen(false) })
            : children}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({
  children,
  icon,
  onClick,
  danger = false,
  disabled = false,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
                w-full flex items-center gap-3 px-4 py-2 text-sm text-left
                transition-colors
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed"
                    : danger
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                }
                ${className}
            `}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
};

// Dropdown Divider
export const DropdownDivider = () => (
  <div className="my-2 border-t border-white/10" />
);

// Dropdown Header
export const DropdownHeader = ({ children }) => (
  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
    {children}
  </div>
);

export default Dropdown;
