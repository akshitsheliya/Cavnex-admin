import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{ top: 80 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#1a1a1a",
          color: "#ffffff",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: { primary: "#00FF88", secondary: "#000000" },
          style: { borderColor: "rgba(0, 255, 136, 0.2)" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
          style: { borderColor: "rgba(239, 68, 68, 0.2)" },
        },
      }}
    />
  </React.StrictMode>
);
