const express = require("express");
const { createCheckoutSession } = require("../controllers/paymentsController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-checkout-session", requireAuth, createCheckoutSession);

module.exports = router;
