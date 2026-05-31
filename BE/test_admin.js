const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Order = require("./models/Order");
const User = require("./models/User");
const Service = require("./models/Service");

dotenv.config();

async function runDiagnostics() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for diagnostics...");

    const totalUsers = await User.countDocuments();
    const totalServices = await Service.countDocuments();
    const totalOrders = await Order.countDocuments();
    console.log({ totalUsers, totalServices, totalOrders });

    const completedOrders = await Order.find({ status: "completed" });
    console.log("Completed orders count:", completedOrders.length);

    completedOrders.forEach((o, i) => {
      console.log(`Order ${i}: amount = ${o.amount}, paymentDate = ${o.paymentDate}, createdAt = ${o.createdAt}`);
    });

    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    console.log("Calculated revenue:", totalRevenue);

    // Run monthly & quarterly loop
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
      year: currentYear,
      month: i + 1,
      amount: 0
    }));
    const quarterlyRevenue = [
      { quarter: 1, amount: 0 },
      { quarter: 2, amount: 0 },
      { quarter: 3, amount: 0 },
      { quarter: 4, amount: 0 }
    ];

    completedOrders.forEach((order) => {
      const date = order.paymentDate || order.createdAt;
      if (!date) return;
      
      const orderDate = new Date(date);
      const year = orderDate.getFullYear();
      
      if (year === currentYear) {
        const monthIndex = orderDate.getMonth(); // 0-11
        monthlyRevenue[monthIndex].amount += (order.amount || 0);
        
        const quarter = Math.floor(monthIndex / 3) + 1; // 1-4
        quarterlyRevenue[quarter - 1].amount += (order.amount || 0);
      }
    });

    console.log("Monthly revenue:", monthlyRevenue);
    console.log("Quarterly revenue:", quarterlyRevenue);

    console.log("Diagnostics PASSED successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Diagnostics FAILED with error:", error);
    process.exit(1);
  }
}

runDiagnostics();
