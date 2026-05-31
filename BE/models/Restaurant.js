const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: String },
  rating: { type: Number, default: 5 },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);
