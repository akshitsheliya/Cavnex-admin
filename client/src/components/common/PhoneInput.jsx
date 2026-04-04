import React from 'react';

/**
 * PhoneInput
 *
 * A wrapper around the project's existing Input styling that shows a "+91" prefix
 * for Indian phone numbers. Keeps the same visual language as Input.jsx.
 *
 * Props:
 *  - label, name, value, onChange, onBlur, error, required, disabled, className
 *  - placeholder (defaults to "98765 43210")
 */
const PhoneInput = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  placeholder = '98765 43210',
}) => {
  /** Strip non-digit chars and keep max 10 digits */
  const handleChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    // Provide a synthetic event compatible with existing handleChange patterns
    onChange({ target: { name, value: digitsOnly } });
  };

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
      <div className="relative flex">
        {/* Country code prefix */}
        <div
          className={`
            flex items-center px-3 rounded-l-xl border border-r-0 text-sm font-medium
            bg-white/5 border-white/10 text-gray-400
            ${error ? 'border-red-500/50' : ''}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          🇮🇳 +91
        </div>

        <input
          type="tel"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          inputMode="numeric"
          maxLength={10}
          className={`
            flex-1 px-4 py-3.5 rounded-r-xl text-white placeholder-gray-500
            transition-all duration-300 outline-none
            bg-white/5 border border-white/10
            focus:border-neon-green/50 focus:bg-white/[0.07]
            focus:shadow-[0_0_20px_rgba(0,255,136,0.15)]
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
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

export default PhoneInput;
