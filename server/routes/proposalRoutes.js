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
const {
  createProposalValidator,
  updateProposalValidator,
  getProposalsValidator,
  proposalIdValidator,
} = require("../validators/proposalValidator");

router.use(protect);

// Stats route
router.get("/stats", getProposalStats);

// Create from calculator
router.post("/from-calculator", createFromCalculator);

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

module.exports = router;
