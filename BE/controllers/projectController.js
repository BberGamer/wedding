const Project = require("../models/Project");
const Order = require("../models/Order");
const Service = require("../models/Service");

// ─── Customer: Get all projects for logged-in customer ───────────────────────
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ customer: req.user.id })
      .populate("service", "name category image price priceLabel address phone")
      .populate("vendor", "name email phone avatar")
      .populate("order", "amount status paymentDate eventDate txnRef")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Customer: Get single project detail ─────────────────────────────────────
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("service", "name category image price priceLabel address phone website facebook description")
      .populate("vendor", "name email phone avatar description facebook instagram")
      .populate("order", "amount status paymentDate eventDate txnRef customerName customerPhone eventLocation note items");

    if (!project) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });
    }

    // Only owner can view their project
    if (project.customer.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "vendor") {
      return res.status(403).json({ success: false, message: "Bạn không có quyền xem dự án này" });
    }

    res.json({ success: true, project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin/Vendor: Create a project from an order ────────────────────────────
exports.createProject = async (req, res) => {
  try {
    const { orderId, title, description, startDate, endDate, milestones, notes } = req.body;

    const order = await Order.findById(orderId).populate("service");
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // Check if project already exists for this order
    const existing = await Project.findOne({ order: orderId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Dự án đã tồn tại cho đơn hàng này" });
    }

    const project = await Project.create({
      order: orderId,
      customer: order.user,
      vendor: order.service?.vendor || req.user.id,
      service: order.service._id,
      title: title || `Dự án cưới - ${order.service.name}`,
      description: description || "",
      startDate: startDate || new Date(),
      endDate: endDate || null,
      totalBudget: order.amount,
      notes: notes || "",
      milestones: (milestones || []).map((m, i) => ({
        ...m,
        order: i,
        status: m.status || "pending"
      }))
    });

    const populated = await Project.findById(project._id)
      .populate("service", "name category image price")
      .populate("vendor", "name email phone")
      .populate("order", "amount status paymentDate eventDate");

    res.status(201).json({ success: true, project: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin/Vendor: Update project info ────────────────────────────────────────
exports.updateProject = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status, notes, coverImage } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (startDate !== undefined) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;
    if (status !== undefined) project.status = status;
    if (notes !== undefined) project.notes = notes;
    if (coverImage !== undefined) project.coverImage = coverImage;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("service", "name category image price")
      .populate("vendor", "name email phone")
      .populate("order", "amount status paymentDate eventDate");

    res.json({ success: true, project: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Admin/Vendor: Update a milestone's status ────────────────────────────────
exports.updateMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { status, notes, completedAt } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mốc tiến độ" });
    }

    const allowedTransitions = {
      pending: ["in_progress"],
      in_progress: ["completed", "rejected", "pending"],
      completed: ["in_progress"],
      rejected: ["pending", "in_progress"]
    };

    if (status && !allowedTransitions[milestone.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển từ trạng thái "${milestone.status}" sang "${status}"`
      });
    }

    if (status) milestone.status = status;
    if (notes !== undefined) milestone.notes = notes;
    if (status === "completed") milestone.completedAt = completedAt || new Date();

    // Auto-complete project if all milestones done
    const allDone = project.milestones.every(m => m.status === "completed");
    if (allDone) project.status = "completed";

    await project.save();

    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Admin/Vendor: Add milestone to project ───────────────────────────────────
exports.addMilestone = async (req, res) => {
  try {
    const { title, description, dueDate, order: milestoneOrder } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });
    }

    project.milestones.push({
      title,
      description: description || "",
      dueDate: dueDate || null,
      status: "pending",
      order: milestoneOrder ?? project.milestones.length
    });

    await project.save();
    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ─── Admin: Get all projects ───────────────────────────────────────────────────
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate("customer", "name email phone")
      .populate("service", "name category image price")
      .populate("vendor", "name email")
      .populate("order", "amount status eventDate")
      .sort({ createdAt: -1 });

    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── Admin/Vendor: Delete project ─────────────────────────────────────────────
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Không tìm thấy dự án" });
    }
    res.json({ success: true, message: "Đã xoá dự án" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
