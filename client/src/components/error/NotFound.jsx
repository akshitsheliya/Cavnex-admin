import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400">
            The page you're looking for doesn't exist.
          </p>
        </div>

        <Button
          onClick={() => navigate("/")}
          variant="primary"
          className="w-full"
        >
          Go Home
        </Button>
      </div>
    </div>
  );
}
