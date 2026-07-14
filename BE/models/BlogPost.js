const mongoose = require("mongoose");

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ["facebook", "manual"],
    default: "facebook",
  },
  facebookUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.type === "facebook") {
          return v && v.includes("facebook.com");
        }
        return true;
      },
      message: "Facebook URL is required for Facebook-type blog posts.",
    },
  },
  content: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    default: "AN Wedding",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlogPost", BlogPostSchema);
