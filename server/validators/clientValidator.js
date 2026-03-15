const { body, param, query } = require("express-validator");

const createClientValidator = [
  body("clientName")
    .trim()
    .notEmpty()
    .withMessage("Client name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Client name must be between 2 and 100 characters"),

  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required")
    .isLength({ max: 200 })
    .withMessage("Business name cannot exceed 200 characters"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry cannot exceed 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number"),

  body("alternatePhone").optional().trim(),

  body("website").optional().trim(),

  body("gstNumber").optional().trim().toUpperCase(),

  body("address.street").optional().trim(),

  body("address.city").optional().trim(),

  body("address.state").optional().trim(),

  body("address.country").optional().trim(),

  body("address.pincode").optional().trim(),

  body("contactPerson.name").optional().trim(),

  body("contactPerson.designation").optional().trim(),

  body("contactPerson.email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid contact email")
    .normalizeEmail(),

  body("contactPerson.phone").optional().trim(),

  body("source")
    .optional()
    .isIn([
      "website",
      "instagram",
      "referral",
      "google",
      "cold_call",
      "linkedin",
      "facebook",
      "lead_conversion",
      "other",
    ])
    .withMessage("Invalid source"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "on_hold"])
    .withMessage("Invalid status"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

const updateClientValidator = [
  param("id").isMongoId().withMessage("Invalid client ID"),

  body("clientName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Client name must be between 2 and 100 characters"),

  body("businessName")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Business name cannot exceed 200 characters"),

  body("industry")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Industry cannot exceed 100 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("phone")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Please enter a valid 10-digit phone number"),

  body("status")
    .optional()
    .isIn(["active", "inactive", "on_hold"])
    .withMessage("Invalid status"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),
];

const getClientsValidator = [
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
    .isIn(["active", "inactive", "on_hold"])
    .withMessage("Invalid status"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
];

const clientIdValidator = [
  param("id").isMongoId().withMessage("Invalid client ID"),
];

module.exports = {
  createClientValidator,
  updateClientValidator,
  getClientsValidator,
  clientIdValidator,
};
