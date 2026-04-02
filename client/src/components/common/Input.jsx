import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon,
  className = "",
  ...rest
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          {label}
          {required && <span className="text-neon-green ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          {...rest}
          className={`
                        w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 
                        transition-all duration-300 outline-none
                        bg-white/5 border border-white/10
                        focus:border-neon-green/50 focus:bg-white/[0.07]
                        focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]
                        ${icon ? "pl-12" : ""}
                        ${error ? "border-red-500/50 focus:border-red-500" : ""}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                    `}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
