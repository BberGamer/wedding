const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  getMyProjects,
  getProjectById,
  createProject,
  updateProject,
  updateMilestone,
  addMilestone,
  getAllProjects,
  deleteProject
} = require("../controllers/projectController");

// ── Customer routes ──────────────────────────────────────────────────────────
// GET  /api/projects/my           → list logged-in user's projects
router.get("/my", protect, getMyProjects);

// GET  /api/projects/:id          → single project detail (owner / admin / vendor)
router.get("/:id", protect, getProjectById);

// ── Admin / Vendor routes ─────────────────────────────────────────────────────
// GET  /api/projects              → all projects (admin only)
router.get("/", protect, authorize("admin"), getAllProjects);

// POST /api/projects              → create new project from order
router.post("/", protect, authorize("admin", "vendor"), createProject);

// PUT  /api/projects/:id          → update project info
router.put("/:id", protect, authorize("admin", "vendor"), updateProject);

// DELETE /api/projects/:id        → delete project
router.delete("/:id", protect, authorize("admin"), deleteProject);

// POST /api/projects/:id/milestones       → add milestone
router.post("/:id/milestones", protect, authorize("admin", "vendor"), addMilestone);

// PUT  /api/projects/:projectId/milestones/:milestoneId  → update milestone
router.put(
  "/:projectId/milestones/:milestoneId",
  protect,
  authorize("admin", "vendor"),
  updateMilestone
);

module.exports = router;
