import React from "react";
import Button from "../common/Button";

const ErrorFallback = ({ error, errorInfo, onReset }) => {
  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        {/* Error Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-400 mb-6">
          We're sorry, but something unexpected happened. Please try again.
        </p>

        {/* Error details in development */}
        {isDev && error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
            <p className="text-red-400 font-mono text-sm mb-2">
              {error.toString()}
            </p>
            {errorInfo?.componentStack && (
              <pre className="text-xs text-gray-500 overflow-auto max-h-40">
                {errorInfo.componentStack}
              </pre>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="ghost" onClick={() => window.location.reload()}>
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Reload Page
          </Button>
          {onReset && <Button onClick={onReset}>Try Again</Button>}
        </div>

        {/* Back to home */}
        <a
          href="/"
          className="inline-block mt-6 text-sm text-gray-500 hover:text-white transition-colors"
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default ErrorFallback;
