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
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
