const express = require("express");
const router = express.Router();
const { 
  getServices, 
  createService, 
  getServiceById,
  getVendorServices,
  updateService,
  deleteService
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.route("/")
  .get(getServices)
  .post(protect, authorize("admin", "vendor"), createService);

router.route("/vendor/my-services")
  .get(protect, authorize("admin", "vendor"), getVendorServices);

router.route("/:id")
  .get(getServiceById)
  .put(protect, authorize("admin", "vendor"), updateService)
  .delete(protect, authorize("admin", "vendor"), deleteService);

module.exports = router;

