import React, { forwardRef } from "react";
import { useFormContext } from "./Form";

const FormInput = forwardRef(
  (
    {
      label,
      name,
      type = "text",
      placeholder,
      value,
      onChange,
      onBlur,
      error,
      helperText,
      required = false,
      disabled = false,
      className = "",
      leftIcon,
      rightIcon,
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
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={`
                        w-full bg-white/5 border rounded-xl text-white 
                        placeholder-gray-500 transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-neon-green/50
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${sizeClasses[size]}
                        ${leftIcon ? "pl-10" : ""}
                        ${rightIcon ? "pr-10" : ""}
                        ${
                          fieldError
                            ? "border-red-500 focus:border-red-500"
                            : "border-white/10 focus:border-neon-green/50"
                        }
                    `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
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

FormInput.displayName = "FormInput";

export default FormInput;
