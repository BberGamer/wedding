const mongoose = require("mongoose");

const websiteVisitSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    path: {
      type: String,
      required: true,
      index: true
    },
    title: {
      type: String,
      default: ""
    },
    referrer: {
      type: String,
      default: ""
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    role: {
      type: String,
      default: ""
    },
    ip: {
      type: String,
      default: ""
    },
    userAgent: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

websiteVisitSchema.index({ createdAt: -1 });
websiteVisitSchema.index({ path: 1, createdAt: -1 });

module.exports = mongoose.model("WebsiteVisit", websiteVisitSchema);
