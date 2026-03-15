import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  dot = false,
  removable = false,
  onRemove,
  className = "",
}) => {
  const variants = {
    default: "bg-white/10 text-gray-300",
    primary: "bg-neon-green/20 text-neon-green",
    secondary: "bg-neon-blue/20 text-neon-blue",
    success: "bg-green-500/20 text-green-400",
    warning: "bg-yellow-500/20 text-yellow-400",
    danger: "bg-red-500/20 text-red-400",
    info: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const dotColors = {
    default: "bg-gray-400",
    primary: "bg-neon-green",
    secondary: "bg-neon-blue",
    success: "bg-green-400",
    warning: "bg-yellow-400",
    danger: "bg-red-400",
    info: "bg-blue-400",
    purple: "bg-purple-400",
  };

  return (
    <span
      className={`
                inline-flex items-center gap-1.5 rounded-full font-medium
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          <svg
            className="w-3 h-3"
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
    </span>
  );
};

export default Badge;
