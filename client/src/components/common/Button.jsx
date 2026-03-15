import React from "react";

const Button = ({
  children,
  type = "button",
  variant = "neon",
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none";

  const variants = {
    neon: "bg-gradient-to-r from-neon-green to-neon-blue text-black hover:shadow-neon hover:-translate-y-0.5 active:translate-y-0",
    outline:
      "border border-neon-green/50 text-white hover:bg-neon-green/10 hover:border-neon-green hover:shadow-neon",
    glass: "glass text-white hover:bg-white/10",
    danger:
      "bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 hover:border-red-500",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5",
    purple:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:-translate-y-0.5",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
                ${baseStyles} 
                ${variants[variant]} 
                ${sizes[size]} 
                ${disabled || loading ? disabledStyles : ""} 
                ${fullWidth ? "w-full" : ""}
                ${className}
            `}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
