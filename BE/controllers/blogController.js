const BlogPost = require("../models/BlogPost");

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
exports.getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching blog posts." });
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
exports.getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching blog post." });
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private/Admin
exports.createBlogPost = async (req, res) => {
  try {
    const { title, type, facebookUrl, content, author } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }

    if (type === "facebook" && !facebookUrl) {
      return res.status(400).json({ message: "Facebook URL is required for Facebook-type posts." });
    }

    const newPost = await BlogPost.create({
      title,
      type,
      facebookUrl,
      content,
      author,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error while creating blog post." });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    await post.deleteOne();
    res.json({ message: "Blog post deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting blog post." });
  }
};
