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
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  createProposalValidator,
  updateProposalValidator,
  getProposalsValidator,
  proposalIdValidator,
} = require("../validators/proposalValidator");

router.use(protect);
router.use(attachOrganization);

router.get("/stats", getProposalStats);

router.post("/from-calculator", createFromCalculator);

router.post("/:id/status", proposalIdValidator, updateProposalStatus);
router.patch("/:id/status", proposalIdValidator, updateProposalStatus);
router.post("/:id/duplicate", proposalIdValidator, duplicateProposal);

router
  .route("/")
  .get(getProposalsValidator, getProposals)
  .post(createProposalValidator, createProposal);

router
  .route("/:id")
  .get(proposalIdValidator, getProposal)
  .put(updateProposalValidator, updateProposal)
  .delete(proposalIdValidator, deleteProposal);

module.exports = router;
