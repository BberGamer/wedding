const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
  deleteUser,
  getAdminOrders,
  updateOrderStatus,
  getAdminServices
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// All admin routes require authentication and "admin" role
router.use(protect, authorize("admin"));

router.route("/stats")
  .get(getAdminStats);

router.route("/users")
  .get(getAdminUsers);

router.route("/users/:id/role")
  .put(updateUserRole);

router.route("/users/:id")
  .delete(deleteUser);

router.route("/orders")
  .get(getAdminOrders);

router.route("/orders/:id/status")
  .put(updateOrderStatus);

router.route("/services")
  .get(getAdminServices);

module.exports = router;
