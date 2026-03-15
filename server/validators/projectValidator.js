const { body, param, query } = require("express-validator");

const createProjectValidator = [
  body("projectName")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Project name must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client ID"),

  body("projectType")
    .notEmpty()
    .withMessage("Project type is required")
    .isIn(["website", "webapp", "mobileapp", "ecommerce", "custom"])
    .withMessage("Invalid project type"),

  body("status")
    .optional()
    .isIn([
      "planning",
      "design",
      "development",
      "testing",
      "review",
      "completed",
      "on_hold",
      "cancelled",
    ])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("deadline")
    .notEmpty()
    .withMessage("Deadline is required")
    .isISO8601()
    .withMessage("Invalid deadline format")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error("Deadline must be after start date");
      }
      return true;
    }),

  body("budget")
    .notEmpty()
    .withMessage("Budget is required")
    .isNumeric()
    .withMessage("Budget must be a number")
    .custom((value) => value >= 0)
    .withMessage("Budget cannot be negative"),

  body("amountPaid")
    .optional()
    .isNumeric()
    .withMessage("Amount paid must be a number")
    .custom((value) => value >= 0)
    .withMessage("Amount paid cannot be negative"),

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("features")
    .optional()
    .isArray()
    .withMessage("Features must be an array"),

  body("features.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Feature name is required"),

  body("milestones")
    .optional()
    .isArray()
    .withMessage("Milestones must be an array"),

  body("technologies")
    .optional()
    .isArray()
    .withMessage("Technologies must be an array"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Notes cannot exceed 5000 characters"),
];

const updateProjectValidator = [
  param("id").isMongoId().withMessage("Invalid project ID"),

  body("projectName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Project name must be between 2 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),

  body("client").optional().isMongoId().withMessage("Invalid client ID"),

  body("projectType")
    .optional()
    .isIn(["website", "webapp", "mobileapp", "ecommerce", "custom"])
    .withMessage("Invalid project type"),

  body("status")
    .optional()
    .isIn([
      "planning",
      "design",
      "development",
      "testing",
      "review",
      "completed",
      "on_hold",
      "cancelled",
    ])
    .withMessage("Invalid status"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline format"),

  body("budget").optional().isNumeric().withMessage("Budget must be a number"),

  body("progress")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Progress must be between 0 and 100"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Notes cannot exceed 5000 characters"),
];

const getProjectsValidator = [
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
      "planning",
      "design",
      "development",
      "testing",
      "review",
      "completed",
      "on_hold",
      "cancelled",
    ])
    .withMessage("Invalid status"),

  query("projectType")
    .optional()
    .isIn(["website", "webapp", "mobileapp", "ecommerce", "custom"])
    .withMessage("Invalid project type"),

  query("client").optional().isMongoId().withMessage("Invalid client ID"),

  query("search")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term cannot exceed 100 characters"),
];

const projectIdValidator = [
  param("id").isMongoId().withMessage("Invalid project ID"),
];

module.exports = {
  createProjectValidator,
  updateProjectValidator,
  getProjectsValidator,
  projectIdValidator,
};
