const express = require("express");
const router = express.Router();
const { getVendorProfile } = require("../controllers/vendorController");

// Public route - no auth required
router.route("/:id").get(getVendorProfile);

module.exports = router;
