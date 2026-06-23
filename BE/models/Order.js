const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String }
  }],
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "vnpay"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending"
  },
  txnRef: {
    type: String,
    required: true,
    unique: true
  },
  paymentDate: {
    type: Date
  },
  customerName: {
    type: String
  },
  customerPhone: {
    type: String
  },
  customerEmail: {
    type: String
  },
  eventDate: {
    type: Date
  },
  eventTime: {
    type: String
  },
  eventLocation: {
    type: String
  },
  note: {
    type: String
  },
  categorySpecificData: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
