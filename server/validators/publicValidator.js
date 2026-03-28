const { body } = require("express-validator");

const contactLeadValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage(
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage("Email is too long"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit Indian phone number"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Message cannot exceed 2000 characters")
    .customSanitizer((value) => {
      // Remove any potentially dangerous HTML/script tags
      return value ? value.replace(/<[^>]*>/g, "").trim() : value;
    }),

  body("recaptchaToken")
    .optional()
    .isString()
    .withMessage("Invalid reCAPTCHA token"),

  // Honeypot field - should be empty (bots fill this)
  body("website")
    .optional()
    .custom((value) => {
      if (value && value.trim().length > 0) {
        throw new Error("Bot detected");
      }
      return true;
    }),
];

module.exports = {
  contactLeadValidator,
};
