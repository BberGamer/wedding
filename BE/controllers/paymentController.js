const Order = require("../models/Order");
const Service = require("../models/Service");

exports.createOrder = async (req, res) => {
  try {
    const { serviceId, items, amount } = req.body;
    
    if (!serviceId || !items || !amount) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Verify service exists
    const serviceObj = await Service.findById(serviceId);
    if (!serviceObj) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ tương ứng" });
    }

    // Generate unique txnRef
    const txnRef = "ANW_" + Date.now() + "_" + Math.floor(100 + Math.random() * 900);

    const order = await Order.create({
      user: req.user.id,
      service: serviceId,
      items,
      amount,
      txnRef,
      status: "pending"
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { txnRef, status } = req.body;
    
    if (!txnRef || !status) {
      return res.status(400).json({ message: "Thiếu txnRef hoặc status" });
    }

    const order = await Order.findOne({ txnRef });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng" });
    }

    order.status = status; // "completed" or "failed"
    if (status === "completed") {
      order.paymentDate = new Date();
    }
    
    await order.save();

    res.json({ message: "Cập nhật trạng thái thanh toán thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("service")
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SePay webhook to automatically confirm bank transfers via QR
exports.sepayWebhook = async (req, res) => {
  try {
    // 1. Verify SePay security token
    let webhookToken = req.headers["x-sepay-token"] || req.headers["authorization"] || "";
    
    // SePay sent `Authorization: Apikey binh1234` or `Bearer binh1234`
    if (webhookToken.includes(" ")) {
      const parts = webhookToken.split(" ");
      webhookToken = parts[parts.length - 1]; // extracts "binh1234"
    }
    
    const configToken = process.env.SEPAY_WEBHOOK_TOKEN || "sepay_secret_token";
    
    if (webhookToken !== configToken) {
      console.warn(`[SePay Webhook] Unauthorized request blocked - received: "${webhookToken}", expected: "${configToken}"`);
      return res.status(401).json({ success: false, message: "Unauthorized token" });
    }

    const { amount, transferAmount, code, content, description, transactionDate } = req.body;
    const receiveAmount = Number(transferAmount || amount);
    
    if (!receiveAmount) {
      return res.status(400).json({ success: false, message: "Missing transferAmount or amount parameters" });
    }

    // 2. Perform robust matching (since bank systems strip spaces and underscores `_`)
    // Combine all potential message fields into a single uppercase alphanumeric string
    const rawMessage = `${code || ""} ${content || ""} ${description || ""}`;
    const cleanMessage = rawMessage.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    
    console.log(`[SePay Webhook] Received transfer body:`, req.body);
    console.log(`[SePay Webhook] Cleaned transfer content for matching: "${cleanMessage}"`);

    // Let's first search if there is a exact match (fallback)
    let order = null;
    
    // Extract using regex if possible
    const match = rawMessage.toUpperCase().match(/(ANW_\d+_\d+)/);
    if (match) {
      const extractedTxnRef = match[1];
      order = await Order.findOne({ txnRef: extractedTxnRef });
    }

    // If no direct regex match, do the robust pending orders check
    if (!order) {
      const pendingOrders = await Order.find({ status: "pending" });
      for (const po of pendingOrders) {
        const cleanTxnRef = po.txnRef.replace(/[^A-Z0-9]/gi, "").toUpperCase();
        if (cleanMessage.includes(cleanTxnRef)) {
          order = po;
          break;
        }
      }
    }

    if (!order) {
      console.warn(`[SePay Webhook] No matching pending order found for message content: "${rawMessage}"`);
      return res.status(404).json({ success: false, message: "No matching order found" });
    }

    if (order.status === "completed") {
      return res.json({ success: true, message: "Order already completed" });
    }

    // Match amount
    if (receiveAmount < order.amount) {
      console.warn(`[SePay Webhook] Payment amount mismatch: received ${receiveAmount}, expected ${order.amount}`);
      return res.status(400).json({ success: false, message: "Invalid transfer amount" });
    }

    // Update order
    order.status = "completed";
    order.paymentDate = new Date(transactionDate || Date.now());
    await order.save();

    console.log(`[SePay Webhook] Order ${order.txnRef} has been PAID successfully via automatic bank QR!`);
    res.json({ success: true, message: "Order confirmed successfully" });
  } catch (error) {
    console.error("[SePay Webhook Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Polling status for Frontend VietQR page
exports.getOrderStatus = async (req, res) => {
  try {
    const { txnRef } = req.params;
    const order = await Order.findOne({ txnRef }).select("status");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
