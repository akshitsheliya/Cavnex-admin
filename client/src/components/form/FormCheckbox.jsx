import React, { forwardRef } from "react";

const FormCheckbox = forwardRef(
  (
    {
      label,
      name,
      checked,
      onChange,
      error,
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex items-start gap-3 ${className}`}>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={name}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
                    w-5 h-5 border-2 rounded transition-all cursor-pointer
                    peer-checked:bg-neon-green peer-checked:border-neon-green
                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed
                    ${error ? "border-red-500" : "border-white/20"}
                `}
          >
            <svg
              className="w-full h-full text-black opacity-0 peer-checked:opacity-100 transition-opacity"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <label htmlFor={name} className="absolute inset-0 cursor-pointer" />
        </div>

        {label && (
          <label
            htmlFor={name}
            className={`text-sm cursor-pointer ${disabled ? "text-gray-500" : "text-gray-300"}`}
          >
            {label}
          </label>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

export default FormCheckbox;
