import React, { forwardRef } from "react";
import { useFormContext } from "./Form";

const FormTextarea = forwardRef(
  (
    {
      label,
      name,
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required = false,
      disabled = false,
      rows = 4,
      maxLength,
      showCount = false,
      className = "",
      ...props
    },
    ref
  ) => {
    const formContext = useFormContext();
    const fieldError = error || formContext?.errors?.[name];
    const currentLength = value?.length || 0;

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
          <textarea
            ref={ref}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={`
                        w-full px-4 py-3 bg-white/5 border rounded-xl text-white 
                        placeholder-gray-500 transition-all duration-200 resize-none
                        focus:outline-none focus:ring-2 focus:ring-neon-green/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${
                          fieldError
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/10 focus:border-neon-green/50"
                        }
                    `}
            {...props}
          />

          {showCount && maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {currentLength}/{maxLength}
            </div>
          )}
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

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;
