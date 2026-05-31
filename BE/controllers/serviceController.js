const Service = require("../models/Service");

exports.getServices = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      priceMin, 
      priceMax, 
      capacity, 
      location, 
      amenities, 
      sort 
    } = req.query;

    let query = {};

    // 1. Lọc theo danh mục (category)
    if (category) {
      query.category = category;
    }

    // 2. Tìm kiếm theo tên hoặc địa chỉ (search)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } }
      ];
    }

    // 3. Lọc theo khoảng giá (priceMin, priceMax)
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price.$gte = Number(priceMin);
      if (priceMax) query.price.$lte = Number(priceMax);
    }

    // 4. Lọc theo sức chứa tối thiểu (capacity) - Chỉ dùng cho nhà hàng
    if (capacity) {
      query.capacity = { $gte: Number(capacity) };
    }

    // 5. Lọc theo khu vực (location) - Hỗ trợ nhiều khu vực ngăn cách bởi dấu phẩy
    if (location) {
      const locationList = location.split(",").map(loc => loc.trim()).filter(Boolean);
      if (locationList.length > 0) {
        query.location = { $in: locationList };
      }
    }

    // 6. Lọc theo tiện ích (amenities) - Khớp tất cả các tiện ích được chọn
    if (amenities) {
      const amenitiesList = amenities.split(",").map(ame => ame.trim()).filter(Boolean);
      if (amenitiesList.length > 0) {
        query.amenities = { $all: amenitiesList };
      }
    }

    let serviceQuery = Service.find(query);

    // 7. Sắp xếp (sort)
    if (sort === "price_asc") {
      serviceQuery = serviceQuery.sort({ price: 1 });
    } else if (sort === "price_desc") {
      serviceQuery = serviceQuery.sort({ price: -1 });
    } else if (sort === "popular") {
      serviceQuery = serviceQuery.sort({ reviewsCount: -1, rating: -1 });
    } else {
      // Mặc định sắp xếp theo ngày tạo mới nhất
      serviceQuery = serviceQuery.sort({ createdAt: -1 });
    }

    const services = await serviceQuery;
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    req.body.vendor = req.user.id;
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVendorServices = async (req, res) => {
  try {
    const services = await Service.find({ vendor: req.user.id }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    if (req.user.role !== "admin" && service.vendor && service.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền chỉnh sửa dịch vụ này" });
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.json(updatedService);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }

    if (req.user.role !== "admin" && service.vendor && service.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Bạn không có quyền xóa dịch vụ này" });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Xóa dịch vụ thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("vendor", "name email phone address description facebook instagram avatar role");
    if (!service) {
      return res.status(404).json({ message: "Không tìm thấy dịch vụ" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


