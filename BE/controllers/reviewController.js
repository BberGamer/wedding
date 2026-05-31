const Review = require("../models/Review");

exports.getReviews = async (req, res) => {
  try {
    const query = {};
    if (req.query.serviceId) {
      query.serviceId = req.query.serviceId;
    }
    const reviews = await Review.find(query);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
