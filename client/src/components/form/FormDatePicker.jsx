import React, { forwardRef } from "react";
import { useFormContext } from "./Form";

const FormDatePicker = forwardRef(
  (
    {
      label,
      name,
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required = false,
      disabled = false,
      min,
      max,
      className = "",
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();
    const fieldError = error || formContext?.errors?.[name];

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
          <input
            ref={ref}
            type="date"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            min={min}
            max={max}
            className={`
                        w-full px-4 py-3 bg-white/5 border rounded-xl text-white 
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-neon-green/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        [color-scheme:dark]
                        ${
                          fieldError
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/10 focus:border-neon-green/50"
                        }
                    `}
            {...props}
          />

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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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

FormDatePicker.displayName = "FormDatePicker";

export default FormDatePicker;
