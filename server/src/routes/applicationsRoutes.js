const express = require("express");
const {
  getMyApplications,
  acceptApplication,
  rejectApplication,
} = require("../controllers/applicationsController");
const { requireAuth } = require("../middleware/authMiddleware");
const { ensureCan } = require("../middleware/accessMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/my", ensureCan("canRead"), getMyApplications);
router.patch("/:id/accept", ensureCan("canManage"), acceptApplication);
router.patch("/:id/reject", ensureCan("canManage"), rejectApplication);

module.exports = router;
