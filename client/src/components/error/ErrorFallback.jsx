import React from "react";
import { Button } from "../common";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-400 text-sm mb-6">
            {error?.message || "An unexpected error occurred"}
          </p>
        </div>

        <Button
          onClick={resetErrorBoundary}
          variant="primary"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
