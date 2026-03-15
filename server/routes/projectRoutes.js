const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectStatus,
  updateProjectProgress,
  addFeature,
  updateFeature,
  deleteFeature,
  addMilestone,
  getProjectStats,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const {
  createProjectValidator,
  updateProjectValidator,
  getProjectsValidator,
  projectIdValidator,
} = require("../validators/projectValidator");

router.use(protect);

router.get("/stats", getProjectStats);

router
  .route("/")
  .get(getProjectsValidator, getProjects)
  .post(createProjectValidator, createProject);

router
  .route("/:id")
  .get(projectIdValidator, getProject)
  .put(updateProjectValidator, updateProject)
  .delete(projectIdValidator, deleteProject);

router.patch("/:id/status", projectIdValidator, updateProjectStatus);
router.patch("/:id/progress", projectIdValidator, updateProjectProgress);

router.post("/:id/features", projectIdValidator, addFeature);
router.put("/:id/features/:featureId", projectIdValidator, updateFeature);
router.delete("/:id/features/:featureId", projectIdValidator, deleteFeature);

router.post("/:id/milestones", projectIdValidator, addMilestone);

module.exports = router;
