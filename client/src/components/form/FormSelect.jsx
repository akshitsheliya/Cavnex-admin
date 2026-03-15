import React, { forwardRef } from "react";
import { useFormContext } from "./Form";

const FormSelect = forwardRef(
  (
    {
      label,
      name,
      options = [],
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required = false,
      disabled = false,
      placeholder = "Select an option",
      className = "",
      size = "md",
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();
    const fieldError = error || formContext?.errors?.[name];

    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-3",
      lg: "px-5 py-4 text-lg",
    };

    return (
      <div className={className}>
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
          <select
            ref={ref}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            className={`
                        w-full bg-white/5 border rounded-xl text-white 
                        transition-all duration-200 appearance-none cursor-pointer
                        focus:outline-none focus:ring-2 focus:ring-neon-green/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${sizeClasses[size]}
                        ${
                          fieldError
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/10 focus:border-neon-green/50"
                        }
                    `}
            {...props}
          >
            {placeholder && (
              <option value="" className="bg-gray-900">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-900"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom arrow */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
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
          </div>
        </div>

        {(fieldError || helperText) && (
          <p
            className={`mt-1 text-sm ${fieldError ? "text-red-400" : "text-gray-500"}`}
          >
            {fieldError || helperText}
          </p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;
