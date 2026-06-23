const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed", "rejected"],
    default: "pending"
  },
  completedAt: { type: Date },
  notes: { type: String, default: "" },
  attachments: [{
    filename: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  order: { type: Number, default: 0 }
}, { _id: true });

const projectSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  startDate: { type: Date },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled", "paused"],
    default: "active"
  },
  milestones: [milestoneSchema],
  totalBudget: { type: Number, default: 0 },
  coverImage: { type: String, default: "" },
  notes: { type: String, default: "" }
}, { timestamps: true });

// Virtual: calculate overall progress
projectSchema.virtual("progress").get(function () {
  if (!this.milestones || this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.status === "completed").length;
  return Math.round((completed / this.milestones.length) * 100);
});

projectSchema.set("toJSON", { virtuals: true });
projectSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Project", projectSchema);
