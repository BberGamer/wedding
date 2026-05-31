const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  confirmPayment, 
  getUserOrders,
  sepayWebhook,
  getOrderStatus
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder);
router.post("/confirm", protect, confirmPayment);
router.get("/user", protect, getUserOrders);

// SePay automatic payment routes
router.post("/sepay-webhook", sepayWebhook);
router.get("/status/:txnRef", getOrderStatus);

module.exports = router;
