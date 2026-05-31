const User = require("../models/User");
const Service = require("../models/Service");
const Review = require("../models/Review");

// @desc  Get public vendor profile + their services + stats
// @route GET /api/vendors/:id
// @access Public
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id)
      .select("-password")
      .lean();

    if (!vendor) {
      return res.status(404).json({ message: "Không tìm thấy vendor" });
    }

    if (vendor.role !== "vendor" && vendor.role !== "admin") {
      return res.status(403).json({ message: "Người dùng này không phải nhà cung cấp" });
    }

    // Get all services by this vendor
    const services = await Service.find({ vendor: req.params.id })
      .sort({ createdAt: -1 })
      .lean();

    // Compute aggregate stats
    const totalServices = services.length;
    const totalReviews = services.reduce((sum, s) => sum + (s.reviewsCount || 0), 0);
    const avgRating = totalServices > 0
      ? (services.reduce((sum, s) => sum + (s.rating || 5), 0) / totalServices).toFixed(1)
      : "5.0";

    res.json({
      vendor,
      services,
      stats: {
        totalServices,
        totalReviews,
        avgRating
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
