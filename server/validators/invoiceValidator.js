const { body, param, query } = require("express-validator");

const createInvoiceValidator = [
  body("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client ID"),

  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("items.*.description")
    .notEmpty()
    .withMessage("Item description is required"),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("items.*.rate")
    .isFloat({ min: 0 })
    .withMessage("Rate must be a positive number"),

  body("discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discount must be a positive number"),

  body("taxRate")
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage("Tax rate must be between 0 and 100"),

  body("status")
    .optional()
    .isIn([
      "draft",
      "sent",
      "viewed",
      "paid",
      "partial",
      "overdue",
      "cancelled",
    ])
    .withMessage("Invalid status"),
];

const updateInvoiceValidator = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),

  body("dueDate").optional().isISO8601().withMessage("Invalid date format"),

  body("items")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),

  body("status")
    .optional()
    .isIn([
      "draft",
      "sent",
      "viewed",
      "paid",
      "partial",
      "overdue",
      "cancelled",
    ])
    .withMessage("Invalid status"),
];

const getInvoicesValidator = [
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
      "paid",
      "partial",
      "overdue",
      "cancelled",
    ])
    .withMessage("Invalid status"),

  query("client").optional().isMongoId().withMessage("Invalid client ID"),
];

const invoiceIdValidator = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),
];

const recordPaymentValidator = [
  param("id").isMongoId().withMessage("Invalid invoice ID"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ min: 0 })
    .withMessage("Amount must be a positive number"),

  body("paymentMethod")
    .optional()
    .isIn(["bank_transfer", "upi", "cheque", "cash", "card", "other"])
    .withMessage("Invalid payment method"),

  body("paymentDate").optional().isISO8601().withMessage("Invalid date format"),
];

module.exports = {
  createInvoiceValidator,
  updateInvoiceValidator,
  getInvoicesValidator,
  invoiceIdValidator,
  recordPaymentValidator,
};
