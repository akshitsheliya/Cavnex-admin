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
const {
  createLeadValidator,
  updateLeadValidator,
  getLeadsValidator,
  leadIdValidator,
} = require("../validators/leadValidator");

router.use(protect);

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
