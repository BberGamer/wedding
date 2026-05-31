const Order = require("../models/Order");
const User = require("../models/User");
const Service = require("../models/Service");

// Global simulated visits counter that persists in memory
let siteVisits = 14580 + Math.floor(Math.random() * 100);

exports.getAdminStats = async (req, res) => {
  try {
    // Increase visits slightly for each stats query to simulate active traffic
    siteVisits += Math.floor(Math.random() * 5) + 1;

    // 1. General counts
    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    
    // User breakdown by roles
    const adminCount = await User.countDocuments({ role: "admin" });
    const vendorCount = await User.countDocuments({ role: "vendor" });
    const customerCount = await User.countDocuments({ role: "customer" });

    // 2. Booking statistics
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.find({ status: "completed" });
    
    // Calculate total revenue from completed orders
    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.amount, 0);

    // 3. Calculate Monthly and Quarterly Revenue dynamically
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = [];
    const quarterlyRevenue = [
      { quarter: 1, amount: 0 },
      { quarter: 2, amount: 0 },
      { quarter: 3, amount: 0 },
      { quarter: 4, amount: 0 }
    ];

    // Initialize all 12 months for current year
    for (let m = 0; m < 12; m++) {
      monthlyRevenue.push({
        year: currentYear,
        month: m + 1,
        amount: 0
      });
    }

    // Accumulate amounts
    completedOrders.forEach((order) => {
      const date = order.paymentDate || order.createdAt;
      if (!date) return;
      
      const orderDate = new Date(date);
      const year = orderDate.getFullYear();
      
      if (year === currentYear) {
        const monthIndex = orderDate.getMonth(); // 0-11
        monthlyRevenue[monthIndex].amount += order.amount;
        
        const quarter = Math.floor(monthIndex / 3) + 1; // 1-4
        quarterlyRevenue[quarter - 1].amount += order.amount;
      }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalServices,
        totalOrders,
        totalRevenue,
        websiteVisits: siteVisits,
        userBreakdown: {
          admin: adminCount,
          vendor: vendorCount,
          customer: customerCount
        },
        monthlyRevenue,
        quarterlyRevenue
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["admin", "vendor", "customer"].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    // Do not allow self role demotion from admin
    if (req.user.id === req.params.id && role !== "admin") {
      return res.status(400).json({ message: "Bạn không thể tự hạ quyền của chính mình!" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Cập nhật vai trò thành công", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "Bạn không thể tự xoá tài khoản của chính mình!" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.json({ message: "Xoá người dùng thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email phone address role")
      .populate({
        path: "service",
        select: "name category image price address priceLabel phone website facebook description vendor",
        populate: {
          path: "vendor",
          select: "name email phone address description facebook instagram avatar role"
        }
      })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    order.status = status;
    if (status === "completed") {
      order.paymentDate = new Date();
    }
    await order.save();

    const updatedOrder = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("service", "name category image price");

    res.json({ message: "Cập nhật trạng thái đơn book thành công", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAdminServices = async (req, res) => {
  try {
    const services = await Service.find({})
      .populate("vendor", "name email role")
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
