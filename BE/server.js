const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/chat", chatRoutes);

// --- Socket.io authentication middleware ---
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: no token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // { id, role, name, ... }
    next();
  } catch (err) {
    next(new Error("Authentication error: invalid token"));
  }
});

// Keep track of connected admins
const connectedAdmins = new Set();

io.on("connection", (socket) => {
  const { id: userId, role, name } = socket.user;
  const conversationId = `conv_${role === "admin" ? "admin" : userId}`;

  if (role === "admin") {
    // Admin joins a special admin room to receive all customer messages
    socket.join("admin-room");
    connectedAdmins.add(socket.id);
    console.log(`[CHAT] Admin "${name}" connected`);
  } else {
    // Customer joins their own private room
    socket.join(conversationId);
    console.log(`[CHAT] Customer "${name}" (${userId}) connected`);
  }

  // --- Handle customer sending message to admin ---
  socket.on("customer:send", async ({ text }) => {
    if (!text?.trim()) return;
    try {
      const custConvId = `conv_${userId}`;
      const msg = await Message.create({
        conversationId: custConvId,
        sender: userId,
        senderRole: "customer",
        text: text.trim(),
      });

      const payload = {
        _id: msg._id,
        conversationId: custConvId,
        customerId: userId,
        customerName: name,
        senderRole: "customer",
        text: msg.text,
        createdAt: msg.createdAt,
        read: false,
      };

      // Echo back to the customer
      socket.emit("message:new", payload);
      // Broadcast to all connected admins
      io.to("admin-room").emit("message:new", payload);
    } catch (err) {
      socket.emit("chat:error", { message: "Failed to send message" });
    }
  });

  // --- Handle admin sending reply to a specific customer ---
  socket.on("admin:send", async ({ customerId, text }) => {
    if (!text?.trim() || !customerId) return;
    try {
      const custConvId = `conv_${customerId}`;
      const msg = await Message.create({
        conversationId: custConvId,
        sender: userId,
        senderRole: "admin",
        text: text.trim(),
        read: true,
      });

      const payload = {
        _id: msg._id,
        conversationId: custConvId,
        customerId,
        senderRole: "admin",
        adminName: name,
        text: msg.text,
        createdAt: msg.createdAt,
        read: true,
      };

      // Send to the specific customer's room
      io.to(custConvId).emit("message:new", payload);
      // Echo to all admins so they stay in sync
      io.to("admin-room").emit("message:new", payload);
    } catch (err) {
      socket.emit("chat:error", { message: "Failed to send reply" });
    }
  });

  socket.on("disconnect", () => {
    if (role === "admin") {
      connectedAdmins.delete(socket.id);
    }
    console.log(`[CHAT] "${name}" (${role}) disconnected`);
  });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Could not connect to MongoDB", err));
