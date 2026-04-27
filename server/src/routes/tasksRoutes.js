const express = require("express");
const {
  getTasks,
  getTaskById,
  createTask,
  getMyTasks,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");
const {
  applyToTask,
  getTaskApplications,
} = require("../controllers/applicationsController");
const { requireAuth } = require("../middleware/authMiddleware");
const { ensureCan } = require("../middleware/accessMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", ensureCan("canRead"), getTasks);
router.get("/my", ensureCan("canRead"), getMyTasks);
router.get("/:id", ensureCan("canRead"), getTaskById);
router.post("/", ensureCan("canCreateTask"), createTask);
router.patch("/:id", ensureCan("canManage"), updateTask);
router.delete("/:id", ensureCan("canManage"), deleteTask);

router.post("/:id/apply", ensureCan("canApply"), applyToTask);
router.get("/:id/applications", ensureCan("canManage"), getTaskApplications);

module.exports = router;
