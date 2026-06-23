const express = require("express");
const router = express.Router();
const { 
  createOrder, 
  confirmPayment, 
  getUserOrders,
  sepayWebhook,
  getOrderStatus,
  cancelOrder,
  checkAvailability
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createOrder);
router.post("/confirm", protect, confirmPayment);
router.get("/user", protect, getUserOrders);
router.delete("/cancel/:txnRef", protect, cancelOrder);
router.post("/check-availability", checkAvailability);

// SePay automatic payment routes
router.post("/sepay-webhook", sepayWebhook);
router.get("/status/:txnRef", getOrderStatus);

module.exports = router;
