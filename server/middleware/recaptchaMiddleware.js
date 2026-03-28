const axios = require("axios");

const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    // Skip in development if no token provided (for testing)
    if (process.env.NODE_ENV === "development" && !recaptchaToken) {
      console.log("⚠️ reCAPTCHA skipped in development mode");
      return next();
    }

    if (!recaptchaToken) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification required",
      });
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!secretKey) {
      console.error("❌ RECAPTCHA_SECRET_KEY not configured");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Verify with Google
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: secretKey,
          response: recaptchaToken,
          remoteip: req.ip,
        },
      }
    );

    const { success, score, "error-codes": errorCodes } = response.data;

    // For reCAPTCHA v3, check score (0.0 - 1.0, higher is more likely human)
    // For reCAPTCHA v2, just check success
    if (!success) {
      console.log("❌ reCAPTCHA failed:", errorCodes);
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      });
    }

    // For v3: reject if score is too low (likely bot)
    if (score !== undefined && score < 0.5) {
      console.log("❌ reCAPTCHA score too low:", score);
      return res.status(400).json({
        success: false,
        message: "Security verification failed. Please try again.",
      });
    }

    console.log("✅ reCAPTCHA verified, score:", score || "v2");
    next();
  } catch (error) {
    console.error("❌ reCAPTCHA verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Security verification failed. Please try again.",
    });
  }
};

module.exports = { verifyRecaptcha };
