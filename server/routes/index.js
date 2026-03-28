const express = require("express");
const router = express.Router();

// Import all routes
const authRoutes = require("./authRoutes");
const leadRoutes = require("./leadRoutes");
const clientRoutes = require("./clientRoutes");
const projectRoutes = require("./projectRoutes");
const proposalRoutes = require("./proposalRoutes");
const agreementRoutes = require("./agreementRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const templateRoutes = require("./templateRoutes");
const organizationRoutes = require("./organizationRoutes");
const publicRoutes = require("./publicRoutes"); // ✅ ADD THIS

// Test routes (development only)
if (process.env.NODE_ENV === "development") {
  const testRoutes = require("./testRoutes");
  router.use("/test", testRoutes);
}

// ✅ Public routes FIRST (NO authentication required)
router.use("/public", publicRoutes);

// Protected routes (authentication required)
router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/proposals", proposalRoutes);
router.use("/agreements", agreementRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/templates", templateRoutes);
router.use("/org", organizationRoutes);

// Root endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Software Agency Admin API",
    version: "1.0.0",
    endpoints: {
      public: "/api/public", // ✅ ADDED
      test: "/api/test",
      auth: "/api/auth",
      leads: "/api/leads",
      clients: "/api/clients",
      projects: "/api/projects",
      proposals: "/api/proposals",
      agreements: "/api/agreements",
      invoices: "/api/invoices",
      templates: "/api/templates",
      organization: "/api/org",
    },
  });
});

module.exports = router;
