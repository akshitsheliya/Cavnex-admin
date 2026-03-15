const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Database
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/agency-admin",

  // JWT
  JWT_SECRET:
    process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
  JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30,

  // Email
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL || "noreply@agency.com",
  FROM_NAME: process.env.FROM_NAME || "Agency Admin",

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024, // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || "./uploads",

  // Rate Limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15, // minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,

  // CORS
  CORS_ORIGIN:
    process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:5173",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // App
  APP_NAME: process.env.APP_NAME || "Agency Admin System",
  APP_URL: process.env.APP_URL || "http://localhost:5173",
  API_URL: process.env.API_URL || "http://localhost:5000",
};

// Validate required environment variables in production
const validateEnv = () => {
  const required = ["JWT_SECRET", "MONGODB_URI"];
  const missing = [];

  if (env.NODE_ENV === "production") {
    required.forEach((key) => {
      if (!process.env[key]) {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }
};

validateEnv();

module.exports = env;
