const { body, param, query } = require("express-validator");

const createAgreementValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Agreement title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client ID"),

  body("type")
    .optional()
    .isIn([
      "software_development",
      "maintenance",
      "consulting",
      "nda",
      "custom",
    ])
    .withMessage("Invalid agreement type"),

  body("dynamicFields.clientName")
    .notEmpty()
    .withMessage("Client name is required"),

  body("dynamicFields.projectName")
    .notEmpty()
    .withMessage("Project name is required"),

  body("dynamicFields.price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number"),

  body("dynamicFields.timeline").notEmpty().withMessage("Timeline is required"),

  body("status")
    .optional()
    .isIn([
      "draft",
      "sent",
      "viewed",
      "signed",
      "active",
      "completed",
      "terminated",
      "expired",
    ])
    .withMessage("Invalid status"),
];

const updateAgreementValidator = [
  param("id").isMongoId().withMessage("Invalid agreement ID"),

  body("title")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("status")
    .optional()
    .isIn([
      "draft",
      "sent",
      "viewed",
      "signed",
      "active",
      "completed",
      "terminated",
      "expired",
    ])
    .withMessage("Invalid status"),
];

const getAgreementsValidator = [
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
      "draft",
      "sent",
      "viewed",
      "signed",
      "active",
      "completed",
      "terminated",
      "expired",
    ])
    .withMessage("Invalid status"),

  query("client").optional().isMongoId().withMessage("Invalid client ID"),
];

const agreementIdValidator = [
  param("id").isMongoId().withMessage("Invalid agreement ID"),
];

module.exports = {
  createAgreementValidator,
  updateAgreementValidator,
  getAgreementsValidator,
  agreementIdValidator,
};
