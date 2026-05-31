const express = require("express");
const router = express.Router();
const { getRestaurants, createRestaurant } = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getRestaurants)
  .post(protect, authorize("admin", "vendor"), createRestaurant);

module.exports = router;
