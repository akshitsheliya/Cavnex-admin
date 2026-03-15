module.exports = {
  // User Roles
  ROLES: {
    ADMIN: "admin",
    USER: "user",
    MANAGER: "manager",
  },

  // Lead Status
  LEAD_STATUS: {
    NEW: "new",
    CONTACTED: "contacted",
    QUALIFIED: "qualified",
    PROPOSAL: "proposal",
    NEGOTIATION: "negotiation",
    WON: "won",
    LOST: "lost",
  },

  // Project Status
  PROJECT_STATUS: {
    DRAFT: "draft",
    PLANNING: "planning",
    IN_PROGRESS: "in_progress",
    ON_HOLD: "on_hold",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },

  // Invoice Status
  INVOICE_STATUS: {
    DRAFT: "draft",
    SENT: "sent",
    VIEWED: "viewed",
    PAID: "paid",
    PARTIAL: "partial",
    OVERDUE: "overdue",
    CANCELLED: "cancelled",
  },

  // Proposal Status
  PROPOSAL_STATUS: {
    DRAFT: "draft",
    SENT: "sent",
    VIEWED: "viewed",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    EXPIRED: "expired",
  },

  // Agreement Status
  AGREEMENT_STATUS: {
    DRAFT: "draft",
    SENT: "sent",
    SIGNED: "signed",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },

  // File Types
  ALLOWED_FILE_TYPES: {
    IMAGES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    DOCUMENTS: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    ALL: [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ],
  },

  // Error Codes
  ERROR_CODES: {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
    AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",
    NOT_FOUND: "NOT_FOUND",
    DUPLICATE_ERROR: "DUPLICATE_ERROR",
    SERVER_ERROR: "SERVER_ERROR",
    RATE_LIMIT_ERROR: "RATE_LIMIT_ERROR",
  },
};
