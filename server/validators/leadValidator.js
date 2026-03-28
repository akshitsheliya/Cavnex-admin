const { body, param, query } = require("express-validator");

const createLeadValidator = [
  body("leadName")
    .trim()
    .notEmpty()
    .withMessage("Lead name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Lead name must be between 2 and 100 characters"),

  body("businessName")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Business name cannot exceed 200 characters"),

  body("businessType")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Business type cannot exceed 100 characters"),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("city")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City name cannot exceed 100 characters"),

  body("source")
    .optional()
    .isIn([
      "website",
      "website-contact", // ✅ ADDED THIS
      "instagram",
      "referral",
      "google",
      "cold_call",
      "linkedin",
      "facebook",
      "other",
    ])
    .withMessage("Invalid source"),

  body("status")
    .optional()
    .isIn([
      "new",
      "contacted",
      "meeting",
      "proposal_sent",
      "negotiation",
      "closed_won",
      "closed_lost",
    ])
    .withMessage("Invalid status"),

  body("estimatedValue")
    .optional()
    .isNumeric()
    .withMessage("Estimated value must be a number")
    .custom((value) => value >= 0)
    .withMessage("Estimated value cannot be negative"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),

  body("followUpDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid follow-up date format"),
];

const updateLeadValidator = [
  param("id").isMongoId().withMessage("Invalid lead ID"),

  body("leadName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Lead name must be between 2 and 100 characters"),

  body("businessName")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Business name cannot exceed 200 characters"),

  body("businessType")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Business type cannot exceed 100 characters"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("city")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("City name cannot exceed 100 characters"),

  body("source")
    .optional()
    .isIn([
      "website",
      "website-contact", // ✅ ADDED THIS
      "instagram",
      "referral",
      "google",
      "cold_call",
      "linkedin",
      "facebook",
      "other",
    ])
    .withMessage("Invalid source"),

  body("status")
    .optional()
    .isIn([
      "new",
      "contacted",
      "meeting",
      "proposal_sent",
      "negotiation",
      "closed_won",
      "closed_lost",
    ])
    .withMessage("Invalid status"),

  body("estimatedValue")
    .optional()
    .isNumeric()
    .withMessage("Estimated value must be a number"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),

  body("followUpDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid follow-up date format"),
];

const getLeadsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn([
      "new",
      "contacted",
      "meeting",
      "proposal_sent",
      "negotiation",
      "closed_won",
      "closed_lost",
    ])
    .withMessage("Invalid status"),

  query("source")
    .optional()
    .isIn([
      "website",
      "website-contact", // ✅ ADDED THIS
      "instagram",
      "referral",
      "google",
      "cold_call",
      "linkedin",
      "facebook",
      "other",
    ])
    .withMessage("Invalid source"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
];

const leadIdValidator = [
  param("id").isMongoId().withMessage("Invalid lead ID"),
];

module.exports = {
  createLeadValidator,
  updateLeadValidator,
  getLeadsValidator,
  leadIdValidator,
};
