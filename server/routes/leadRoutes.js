const express = require("express");
const router = express.Router();
const {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
  convertToClient,
  getLeadStats,
} = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware"); // ✅ NEW IMPORT
const {
  createLeadValidator,
  updateLeadValidator,
  getLeadsValidator,
  leadIdValidator,
} = require("../validators/leadValidator");

// ✅ Apply both middlewares
router.use(protect);
router.use(attachOrganization); // ✅ NEW LINE

router.get("/stats", getLeadStats);

router
  .route("/")
  .get(getLeadsValidator, getLeads)
  .post(createLeadValidator, createLead);

router
  .route("/:id")
  .get(leadIdValidator, getLead)
  .put(updateLeadValidator, updateLead)
  .delete(leadIdValidator, deleteLead);

router.patch("/:id/status", leadIdValidator, updateLeadStatus);

router.post("/:id/convert", leadIdValidator, convertToClient);

module.exports = router;
