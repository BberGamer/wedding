const express = require("express");
const router = express.Router();
const { getReviews, createReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getReviews)
  .post(protect, authorize("customer", "admin"), createReview);

module.exports = router;
