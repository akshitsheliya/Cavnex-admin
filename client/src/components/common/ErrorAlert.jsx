// src/components/common/ErrorAlert.jsx
import React from "react";

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-red-500/[0.08] border border-red-500/20 flex items-center gap-3 animate-[slideDown_0.3s_ease-out]">
      <div className="p-1.5 rounded-lg bg-red-500/20">
        <svg
          className="w-4 h-4 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-red-400 text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <svg
            className="w-4 h-4"
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
    </div>
  );
};

export default ErrorAlert;
