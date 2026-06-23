const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ["nha_hang", "trang_diem", "xe_hoa", "chup_anh", "vay_cuoi"] 
  },
  address: { type: String, required: true },
  location: { type: String, required: true }, // e.g. "Quận 1", "Tây Hồ", "Hoàn Kiếm", "Thảo Điền", "Sơn Trà", "Hội An"
  price: { type: Number, required: true }, // Numeric value for filtering and sorting (e.g. 2500000)
  priceLabel: { type: String }, // User-friendly text (e.g. "2.500.000đ/bàn" or "Giá từ 3.000.000đ")
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 0 },
  image: { type: String },
  capacity: { type: Number }, // Venue specific
  amenities: [{ type: String }], // Array of strings e.g. ["Sân vườn", "View hồ", "Bãi đỗ xe", "Phòng cô dâu"]
  badge: { type: String }, // e.g. "NỔI BẬT", "MỚI", "ƯU ĐÃI", or null
  
  // New detailed information fields
  phone: { type: String, default: "0901 234 567" },
  website: { type: String, default: "https://anwedding.com" },
  facebook: { type: String, default: "https://facebook.com/anwedding" },
  description: { type: String, default: "Dịch vụ cưới hỏi chất lượng cao, mang lại trải nghiệm tuyệt vời và đáng nhớ cho ngày hạnh phúc của bạn." },
  includedServices: [{ type: String }], // e.g. ["Nước đón khách", "MC dẫn chương trình", "Pháo hoa", "Âm thanh ánh sáng"]
  album: [{ type: String }], // Array of image URLs for photo album
  pricingDetails: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    desc: { type: String }
  }],
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comparisonAttributes: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);

