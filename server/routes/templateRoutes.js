const express = require("express");
const router = express.Router();
const {
  getTemplates,
  getTemplate,
  getTemplateBySlug,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  renderTemplate,
  duplicateTemplate,
  getTemplateStats,
  getDefaultTemplates,
  seedDefaultTemplates,
} = require("../controllers/templateController");
const { protect } = require("../middleware/authMiddleware");
const { attachOrganization } = require("../middleware/organizationMiddleware"); // ✅ NEW IMPORT
const {
  createTemplateValidator,
  updateTemplateValidator,
  getTemplatesValidator,
  templateIdValidator,
  renderTemplateValidator,
} = require("../validators/templateValidator");

// ✅ Apply both middlewares
router.use(protect);
router.use(attachOrganization); // ✅ NEW LINE

// Stats route
router.get("/stats", getTemplateStats);

// Default templates
router.get("/defaults", getDefaultTemplates);
router.post("/seed", seedDefaultTemplates);

// Get by slug
router.get("/slug/:slug", getTemplateBySlug);

// Main CRUD routes
router
  .route("/")
  .get(getTemplatesValidator, getTemplates)
  .post(createTemplateValidator, createTemplate);

router
  .route("/:id")
  .get(templateIdValidator, getTemplate)
  .put(updateTemplateValidator, updateTemplate)
  .delete(templateIdValidator, deleteTemplate);

// Additional actions
router.post("/:id/render", renderTemplateValidator, renderTemplate);
router.post("/:id/duplicate", templateIdValidator, duplicateTemplate);

module.exports = router;
