const express = require("express");
const router = express.Router();

const testRoutes = require("./testRoutes");
const authRoutes = require("./authRoutes");
const leadRoutes = require("./leadRoutes");
const clientRoutes = require("./clientRoutes");
const projectRoutes = require("./projectRoutes");
const proposalRoutes = require("./proposalRoutes");
const agreementRoutes = require("./agreementRoutes");
const invoiceRoutes = require("./invoiceRoutes");
const templateRoutes = require("./templateRoutes");

router.use("/test", testRoutes);
router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);
router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/proposals", proposalRoutes);
router.use("/agreements", agreementRoutes);
router.use("/invoices", invoiceRoutes);
router.use("/templates", templateRoutes);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Software Agency Admin API",
    version: "1.0.0",
    endpoints: {
      test: "/api/test",
      auth: "/api/auth",
      leads: "/api/leads",
      clients: "/api/clients",
      projects: "/api/projects",
      proposals: "/api/proposals",
      agreements: "/api/agreements",
      invoices: "/api/invoices",
      templates: "/api/templates",
    },
  });
});

module.exports = router;
