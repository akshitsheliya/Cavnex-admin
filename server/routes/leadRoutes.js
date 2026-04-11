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
  getReminders,
  getAllReminders,
  setReminder,
  updateReminderStatus,
  deleteReminder,
  getReminderStats,
} = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  createLeadValidator,
  updateLeadValidator,
  getLeadsValidator,
  leadIdValidator,
} = require("../validators/leadValidator");

router.use(protect);
router.use(attachOrganization);

router.get("/stats", getLeadStats);
router.get("/reminders/stats", getReminderStats);
router.get("/reminders/all", getAllReminders);
router.get("/reminders", getReminders);

router.post("/:id/status", leadIdValidator, updateLeadStatus);
router.patch("/:id/status", leadIdValidator, updateLeadStatus);

router.post("/:id/convert", leadIdValidator, convertToClient);

router.post("/:id/reminder/status", leadIdValidator, updateReminderStatus);
router.patch("/:id/reminder/status", leadIdValidator, updateReminderStatus);
router.post("/:id/reminder/delete", leadIdValidator, deleteReminder);
router.delete("/:id/reminder", leadIdValidator, deleteReminder);
router.post("/:id/reminder", leadIdValidator, setReminder);

router
  .route("/")
  .get(getLeadsValidator, getLeads)
  .post(createLeadValidator, createLead);

router
  .route("/:id")
  .get(leadIdValidator, getLead)
  .put(updateLeadValidator, updateLead)
  .delete(leadIdValidator, deleteLead);

module.exports = router;
