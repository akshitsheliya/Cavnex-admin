const rateLimit = require("express-rate-limit");

// Rate limiter for public contact form
const publicContactLimiter = rateLimit({
  windowMs: (parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
  max: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX) || 5,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // ✅ ADD: Validate to prevent X-Forwarded-For issues
  validate: {
    xForwardedForHeader: false,
  },
});

// Stricter limiter for repeated attempts
const strictContactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many contact attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // ✅ ADD: Validate to prevent X-Forwarded-For issues
  validate: {
    xForwardedForHeader: false,
  },
});

module.exports = { publicContactLimiter, strictContactLimiter };
