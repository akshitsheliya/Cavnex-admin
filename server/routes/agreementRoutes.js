const express = require("express");
const router = express.Router();
const {
  getAgreements,
  getAgreement,
  createAgreement,
  updateAgreement,
  deleteAgreement,
  updateAgreementStatus,
  duplicateAgreement,
  getAgreementStats,
} = require("../controllers/agreementController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware"); // ✅ NEW IMPORT
const {
  createAgreementValidator,
  updateAgreementValidator,
  getAgreementsValidator,
  agreementIdValidator,
} = require("../validators/agreementValidator");

// ✅ Apply both middlewares
router.use(protect);
router.use(attachOrganization); // ✅ NEW LINE

// Stats route
router.get("/stats", getAgreementStats);

// Main CRUD routes
router
  .route("/")
  .get(getAgreementsValidator, getAgreements)
  .post(createAgreementValidator, createAgreement);

router
  .route("/:id")
  .get(agreementIdValidator, getAgreement)
  .put(updateAgreementValidator, updateAgreement)
  .delete(agreementIdValidator, deleteAgreement);

// Additional actions
router.patch("/:id/status", agreementIdValidator, updateAgreementStatus);
router.post("/:id/duplicate", agreementIdValidator, duplicateAgreement);

module.exports = router;
