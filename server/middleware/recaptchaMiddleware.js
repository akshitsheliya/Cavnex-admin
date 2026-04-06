const axios = require("axios");

const verifyRecaptcha = async (req, res, next) => {
  try {
    const { recaptchaToken } = req.body;

    if (process.env.NODE_ENV === "development" && !recaptchaToken) {
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

    if (!success) {
      return res.status(400).json({
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      });
    }

    if (score !== undefined && score < 0.5) {
      return res.status(400).json({
        success: false,
        message: "Security verification failed. Please try again.",
      });
    }

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
