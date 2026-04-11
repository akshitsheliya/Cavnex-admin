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
const { attachOrganization } = require("../middleware/organizationMiddleware");
const {
  createClientValidator,
  updateClientValidator,
  getClientsValidator,
  clientIdValidator,
} = require("../validators/clientValidator");

router.use(protect);
router.use(attachOrganization);

router.get("/stats", getClientStats);

router.post("/:id/status", clientIdValidator, updateClientStatus);
router.patch("/:id/status", clientIdValidator, updateClientStatus);

router.get("/:id/projects", clientIdValidator, getClientProjects);
router.get("/:id/invoices", clientIdValidator, getClientInvoices);
router.get("/:id/proposals", clientIdValidator, getClientProposals);

router
  .route("/")
  .get(getClientsValidator, getClients)
  .post(createClientValidator, createClient);

router
  .route("/:id")
  .get(clientIdValidator, getClient)
  .put(updateClientValidator, updateClient)
  .delete(clientIdValidator, deleteClient);

module.exports = router;
