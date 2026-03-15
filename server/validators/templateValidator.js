const { body, param, query } = require("express-validator");

const createTemplateValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Template name is required")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("type")
    .notEmpty()
    .withMessage("Template type is required")
    .isIn(["proposal", "agreement", "invoice", "email", "custom"])
    .withMessage("Invalid template type"),

  body("category")
    .optional()
    .isIn(["cover", "section", "terms", "email", "full", "snippet"])
    .withMessage("Invalid category"),

  body("content").notEmpty().withMessage("Template content is required"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  body("sections")
    .optional()
    .isArray()
    .withMessage("Sections must be an array"),

  body("sections.*.key")
    .optional()
    .notEmpty()
    .withMessage("Section key is required"),

  body("sections.*.title")
    .optional()
    .notEmpty()
    .withMessage("Section title is required"),

  body("sections.*.content")
    .optional()
    .notEmpty()
    .withMessage("Section content is required"),

  body("placeholders")
    .optional()
    .isArray()
    .withMessage("Placeholders must be an array"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),
];

const updateTemplateValidator = [
  param("id").isMongoId().withMessage("Invalid template ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("type")
    .optional()
    .isIn(["proposal", "agreement", "invoice", "email", "custom"])
    .withMessage("Invalid template type"),

  body("category")
    .optional()
    .isIn(["cover", "section", "terms", "email", "full", "snippet"])
    .withMessage("Invalid category"),
];

const getTemplatesValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(["proposal", "agreement", "invoice", "email", "custom"])
    .withMessage("Invalid template type"),

  query("category")
    .optional()
    .isIn(["cover", "section", "terms", "email", "full", "snippet"])
    .withMessage("Invalid category"),
];

const templateIdValidator = [
  param("id").isMongoId().withMessage("Invalid template ID"),
];

const renderTemplateValidator = [
  param("id").isMongoId().withMessage("Invalid template ID"),

  body("data").optional().isObject().withMessage("Data must be an object"),
];

module.exports = {
  createTemplateValidator,
  updateTemplateValidator,
  getTemplatesValidator,
  templateIdValidator,
  renderTemplateValidator,
};
