const express = require("express");
const router = express.Router();
const { getChatHistory, getConversations, markAsRead } = require("../controllers/chatController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Customer: get their own chat history
router.get("/history/:customerId", protect, getChatHistory);

// Admin: list all conversations
router.get("/conversations", protect, authorize("admin"), getConversations);

// Admin: mark messages as read
router.patch("/read/:customerId", protect, authorize("admin"), markAsRead);

module.exports = router;
