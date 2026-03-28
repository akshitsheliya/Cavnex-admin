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

router.get("/test-email", async (req, res) => {
  try {
    // First test config
    const configTest = await testEmailConfig();
    console.log("📧 Email Config Test:", configTest);

    if (!configTest.success) {
      return res.json({
        success: false,
        message: "Email configuration invalid",
        error: configTest.message,
        config: {
          host: process.env.SMTP_HOST || "NOT SET",
          port: process.env.SMTP_PORT || "NOT SET",
          user: process.env.SMTP_USER ? "SET" : "NOT SET",
          pass: process.env.SMTP_PASS ? "SET" : "NOT SET",
          notificationEmail: process.env.NOTIFICATION_EMAIL || "NOT SET",
        },
      });
    }

    // Send test email
    const result = await sendNewLeadNotification({
      name: "Test User",
      email: "test@example.com",
      phone: "9876543210",
      message: "This is a test email from Cavnex API",
      source: "test-endpoint",
      createdAt: new Date(),
    });

    res.json({
      success: result.success,
      message: result.success ? "Test email sent!" : "Failed to send email",
      details: result,
    });
  } catch (error) {
    console.error("❌ Test email error:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
});

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
