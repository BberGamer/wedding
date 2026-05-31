const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "vendor", "customer"], 
    default: "customer" 
  },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  description: { type: String, default: "" },
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  avatar: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
