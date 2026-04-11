const express = require("express");
const router = express.Router();
const {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  recordPayment,
  duplicateInvoice,
  getInvoiceStats,
  sendInvoice,
} = require("../controllers/invoiceController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  createInvoiceValidator,
  updateInvoiceValidator,
  getInvoicesValidator,
  invoiceIdValidator,
  recordPaymentValidator,
} = require("../validators/invoiceValidator");

router.use(protect);
router.use(attachOrganization);

router.get("/stats", getInvoiceStats);

router.post("/:id/status", invoiceIdValidator, updateInvoiceStatus);
router.patch("/:id/status", invoiceIdValidator, updateInvoiceStatus);
router.post("/:id/payment", recordPaymentValidator, recordPayment);
router.post("/:id/duplicate", invoiceIdValidator, duplicateInvoice);
router.post("/:id/send", invoiceIdValidator, sendInvoice);

router
  .route("/")
  .get(getInvoicesValidator, getInvoices)
  .post(createInvoiceValidator, createInvoice);

router
  .route("/:id")
  .get(invoiceIdValidator, getInvoice)
  .put(updateInvoiceValidator, updateInvoice)
  .delete(invoiceIdValidator, deleteInvoice);

module.exports = router;
