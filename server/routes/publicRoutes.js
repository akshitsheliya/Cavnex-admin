const express = require("express");
const router = express.Router();

// Controllers
const {
  createContactLead,
  healthCheck,
} = require("../controllers/publicController");

// Validators
const { contactLeadValidator } = require("../validators/publicValidator");

// Middleware
const { verifyRecaptcha } = require("../middleware/recaptchaMiddleware");
const {
  publicContactLimiter,
  strictContactLimiter,
} = require("../middleware/publicRateLimiter");

/**
 * @route   GET /api/public/health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get("/health", healthCheck);

/**
 * @route   POST /api/public/contact-lead
 * @desc    Create a new lead from website contact form
 * @access  Public (with reCAPTCHA & rate limiting)
 */
router.post(
  "/contact-lead",
  strictContactLimiter, // First: strict hourly limit
  publicContactLimiter, // Second: per-window limit
  contactLeadValidator, // Third: validate input
  verifyRecaptcha, // Fourth: verify reCAPTCHA
  createContactLead // Finally: create lead
);

module.exports = router;
