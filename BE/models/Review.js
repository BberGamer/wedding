const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  rating: { type: Number, default: 5 },
  isHighlight: { type: Boolean, default: false },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
