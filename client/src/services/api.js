import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // ✅ ADD THIS LOG
    if (response.config.url?.includes("/leads")) {
      console.log("🔍 API Response Debug:", {
        url: response.config.url,
        totalFromServer: response.data?.pagination?.total,
        receivedCount: response.data?.data?.length,
        firstItem: response.data?.data?.[0]?._id,
      });
    }

    if (import.meta.env.DEV) {
      console.log(`✅ [API] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error(
        `❌ [API Error] ${error.config?.url}`,
        error.response?.data || error.message
      );
    }
    return Promise.reject(error);
  }
);

export default api;
