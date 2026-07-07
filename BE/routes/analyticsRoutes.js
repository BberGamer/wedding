const express = require("express");
const router = express.Router();
const { trackVisit } = require("../controllers/analyticsController");

router.post("/visit", trackVisit);

module.exports = router;
