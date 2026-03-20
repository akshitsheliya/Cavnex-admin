const express = require("express");
const router = express.Router();
const {
  getProposals,
  getProposal,
  createProposal,
  updateProposal,
  deleteProposal,
  updateProposalStatus,
  duplicateProposal,
  getProposalStats,
  createFromCalculator,
} = require("../controllers/proposalController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware"); // ✅ NEW IMPORT
const {
  createProposalValidator,
  updateProposalValidator,
  getProposalsValidator,
  proposalIdValidator,
} = require("../validators/proposalValidator");

// ✅ Apply both middlewares
router.use(protect);
router.use(attachOrganization); // ✅ NEW LINE

// Stats route
router.get("/stats", getProposalStats);

// Main CRUD routes
router
  .route("/")
  .get(getProposalsValidator, getProposals)
  .post(createProposalValidator, createProposal);

router
  .route("/:id")
  .get(proposalIdValidator, getProposal)
  .put(updateProposalValidator, updateProposal)
  .delete(proposalIdValidator, deleteProposal);

// Additional actions
router.patch("/:id/status", proposalIdValidator, updateProposalStatus);
router.post("/:id/duplicate", proposalIdValidator, duplicateProposal);

// Calculator route
router.post("/from-calculator", createFromCalculator);

module.exports = router;
