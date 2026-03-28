// const rateLimit = require("express-rate-limit");

// // Rate limiter for public contact form
// const publicContactLimiter = rateLimit({
//   windowMs: (process.env.PUBLIC_RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
//   max: process.env.PUBLIC_RATE_LIMIT_MAX || 5, // 5 requests per window
//   message: {
//     success: false,
//     message: "Too many requests. Please try again after 15 minutes.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
//   keyGenerator: (req) => {
//     // Use IP + email combination for more accurate limiting
//     return req.ip + (req.body?.email || "");
//   },
//   skip: (req) => {
//     // Skip rate limiting in development
//     return process.env.NODE_ENV === "development";
//   },
// });

// // Stricter limiter for repeated attempts
// const strictContactLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 10, // 10 requests per hour per IP
//   message: {
//     success: false,
//     message: "Too many contact attempts. Please try again later.",
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// module.exports = { publicContactLimiter, strictContactLimiter };
const rateLimit = require("express-rate-limit");

// Rate limiter for public contact form
const publicContactLimiter = rateLimit({
  windowMs: (process.env.PUBLIC_RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: process.env.PUBLIC_RATE_LIMIT_MAX || 5, // 5 requests per window
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting in development
    return process.env.NODE_ENV === "development";
  },
});

// Stricter limiter for repeated attempts
const strictContactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour per IP
  message: {
    success: false,
    message: "Too many contact attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    return process.env.NODE_ENV === "development";
  },
});

module.exports = { publicContactLimiter, strictContactLimiter };
