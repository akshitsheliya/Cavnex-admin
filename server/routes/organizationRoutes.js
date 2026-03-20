const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  getOrganization,
  updateOrganization,
  addMember,
  removeMember,
  updateMemberRole,
  getMembers,
} = require("../controllers/organizationController");

// All routes require authentication and organization
router.use(protect);
router.use(attachOrganization);

// Organization routes
router.get("/", getOrganization);
router.put("/", updateOrganization);

// Member management
router.get("/members", getMembers);
router.post("/add-member", addMember);
router.delete("/members/:userId", removeMember);
router.patch("/members/:userId/role", updateMemberRole);

module.exports = router;
