export const env = {
  // API
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",

  // App
  APP_NAME: import.meta.env.VITE_APP_NAME || "Agency Admin",
  APP_VERSION: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // Environment
  NODE_ENV: import.meta.env.MODE || "development",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // Features
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true",

  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE, 10) || 10,

  // Timeouts
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT, 10) || 30000,

  // Storage Keys
  TOKEN_KEY: "auth_token",
  USER_KEY: "auth_user",
  THEME_KEY: "app_theme",
};

export default env;
