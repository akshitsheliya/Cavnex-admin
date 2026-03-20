const express = require("express");
const router = express.Router();
const {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  updateClientStatus,
  getClientProjects,
  getClientInvoices,
  getClientProposals,
  getClientStats,
} = require("../controllers/clientController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware"); // ✅ NEW IMPORT
const {
  createClientValidator,
  updateClientValidator,
  getClientsValidator,
  clientIdValidator,
} = require("../validators/clientValidator");

// ✅ Apply both middlewares
router.use(protect);
router.use(attachOrganization); // ✅ NEW LINE

router.get("/stats", getClientStats);

router
  .route("/")
  .get(getClientsValidator, getClients)
  .post(createClientValidator, createClient);

router
  .route("/:id")
  .get(clientIdValidator, getClient)
  .put(updateClientValidator, updateClient)
  .delete(clientIdValidator, deleteClient);

router.patch("/:id/status", clientIdValidator, updateClientStatus);

router.get("/:id/projects", clientIdValidator, getClientProjects);
router.get("/:id/invoices", clientIdValidator, getClientInvoices);
router.get("/:id/proposals", clientIdValidator, getClientProposals);

module.exports = router;
