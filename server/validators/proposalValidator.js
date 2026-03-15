const { body, param, query } = require("express-validator");

const createProposalValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Proposal title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client ID"),

  body("project")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid project ID"),

  body("projectType")
    .optional()
    .isIn(["website", "ecommerce", "webapp", "mobile", "enterprise", "custom"])
    .withMessage("Invalid project type"),

  body("status")
    .optional()
    .isIn(["draft", "sent", "viewed", "accepted", "rejected", "expired"])
    .withMessage("Invalid status"),

  body("template")
    .optional()
    .isIn(["modern", "classic", "minimal", "corporate"])
    .withMessage("Invalid template"),

  body("pricing.basePrice")
    .optional()
    .isNumeric()
    .withMessage("Base price must be a number"),

  body("pricing.discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number"),

  // ✅ FIX: Allow empty string for validUntil
  body("validUntil")
    .optional({ checkFalsy: true }) // Treats empty string as optional
    .custom((value) => {
      if (!value || value === "") return true; // Allow empty
      if (!Date.parse(value)) {
        throw new Error("Invalid date format");
      }
      return true;
    }),
];

const updateProposalValidator = [
  param("id").isMongoId().withMessage("Invalid proposal ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("status")
    .optional()
    .isIn(["draft", "sent", "viewed", "accepted", "rejected", "expired"])
    .withMessage("Invalid status"),
];

const getProposalsValidator = [
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
    .isIn(["draft", "sent", "viewed", "accepted", "rejected", "expired"])
    .withMessage("Invalid status"),

  query("client").optional().isMongoId().withMessage("Invalid client ID"),
];

const proposalIdValidator = [
  param("id").isMongoId().withMessage("Invalid proposal ID"),
];

module.exports = {
  createProposalValidator,
  updateProposalValidator,
  getProposalsValidator,
  proposalIdValidator,
};
