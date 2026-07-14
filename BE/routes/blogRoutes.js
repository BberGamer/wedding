const express = require("express");
const router = express.Router();
const {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  deleteBlogPost,
} = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getBlogPosts)
  .post(protect, authorize("admin"), createBlogPost);

router.route("/:id")
  .get(getBlogPostById)
  .delete(protect, authorize("admin"), deleteBlogPost);

module.exports = router;
