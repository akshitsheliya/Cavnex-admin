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
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  createAgreementValidator,
  updateAgreementValidator,
  getAgreementsValidator,
  agreementIdValidator,
} = require("../validators/agreementValidator");

router.use(protect);
router.use(attachOrganization);

router.get("/stats", getAgreementStats);

router.post("/:id/status", agreementIdValidator, updateAgreementStatus);
router.patch("/:id/status", agreementIdValidator, updateAgreementStatus);
router.post("/:id/duplicate", agreementIdValidator, duplicateAgreement);

router
  .route("/")
  .get(getAgreementsValidator, getAgreements)
  .post(createAgreementValidator, createAgreement);

router
  .route("/:id")
  .get(agreementIdValidator, getAgreement)
  .put(updateAgreementValidator, updateAgreement)
  .delete(agreementIdValidator, deleteAgreement);

module.exports = router;
