import axios from "axios";
import env from "../config/env";

// Create axios instance
const api = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = localStorage.getItem(env.TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (env.IS_DEV && env.ENABLE_DEBUG) {
      console.log(
        `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const duration = new Date() - response.config.metadata?.startTime;

    // Log response in development
    if (env.IS_DEV && env.ENABLE_DEBUG) {
      console.log(
        `✅ [API Response] ${response.config.url} - ${duration}ms`,
        response.data
      );
    }

    return response;
  },
  (error) => {
    const { response, config } = error;

    // Calculate request duration
    const duration = new Date() - config?.metadata?.startTime;

    // Log error in development
    if (env.IS_DEV) {
      console.error(`❌ [API Error] ${config?.url} - ${duration}ms`, {
        status: response?.status,
        message: response?.data?.message || error.message,
      });
    }

    // Handle specific error codes
    if (response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem(env.TOKEN_KEY);
      localStorage.removeItem(env.USER_KEY);

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Transform error for consistent handling
    const errorResponse = {
      success: false,
      status: response?.status || 500,
      message: response?.data?.message || "An unexpected error occurred",
      errors: response?.data?.errors || [],
      originalError: error,
    };

    return Promise.reject(errorResponse);
  }
);

// Base service class
class BaseService {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  // GET all with optional params
  async getAll(params = {}) {
    const response = await api.get(this.endpoint, { params });
    return response.data;
  }

  // GET by ID
  async getById(id) {
    const response = await api.get(`${this.endpoint}/${id}`);
    return response.data;
  }

  // POST create
  async create(data) {
    const response = await api.post(this.endpoint, data);
    return response.data;
  }

  // PUT update
  async update(id, data) {
    const response = await api.put(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  // PATCH partial update
  async patch(id, data) {
    const response = await api.patch(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  // DELETE
  async delete(id) {
    const response = await api.delete(`${this.endpoint}/${id}`);
    return response.data;
  }

  // Custom request
  async request(config) {
    const response = await api({
      ...config,
      url: config.url || this.endpoint,
    });
    return response.data;
  }
}

export { api, BaseService };
export default api;
