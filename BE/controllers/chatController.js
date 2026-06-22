const Message = require("../models/Message");
const User = require("../models/User");

// GET /api/chat/history/:customerId  — load chat history for a conversation
const getChatHistory = async (req, res) => {
  try {
    const { customerId } = req.params;
    const conversationId = `conv_${customerId}`;

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to load chat history" });
  }
};

// GET /api/chat/conversations  — admin only: list all active conversations
const getConversations = async (req, res) => {
  try {
    // Aggregate: get last message per conversationId
    const convos = await Message.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$conversationId",
          lastMessage: { $first: "$text" },
          lastTime: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$read", false] }, { $eq: ["$senderRole", "customer"] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastTime: -1 } },
    ]);

    // Extract customerId from conversationId and fetch user info
    const result = await Promise.all(
      convos.map(async (c) => {
        const customerId = c._id.replace("conv_", "");
        let customerInfo = null;
        try {
          customerInfo = await User.findById(customerId).select("name email avatar");
        } catch (_) {}
        return {
          conversationId: c._id,
          customerId,
          customer: customerInfo,
          lastMessage: c.lastMessage,
          lastTime: c.lastTime,
          unreadCount: c.unreadCount,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to load conversations" });
  }
};

// PATCH /api/chat/read/:customerId  — mark messages as read
const markAsRead = async (req, res) => {
  try {
    const { customerId } = req.params;
    const conversationId = `conv_${customerId}`;
    await Message.updateMany(
      { conversationId, read: false, senderRole: "customer" },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark as read" });
  }
};

module.exports = { getChatHistory, getConversations, markAsRead };
