import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import { API_URL } from "../config";
import styles from "./ComparePage.module.css";

// 5 Categories Configuration
const CATEGORIES = [
  { id: "nha_hang", name: "Sảnh tiệc cưới", icon: "🍽️" },
  { id: "chup_anh", name: "Chụp ảnh cưới", icon: "📸" },
  { id: "trang_diem", name: "Trang điểm cô dâu", icon: "💄" },
  { id: "xe_hoa", name: "Xe hoa ngày cưới", icon: "🚗" },
  { id: "vay_cuoi", name: "Thuê váy & vest", icon: "👗" }
];

// Helper to generate consistent mock details for criteria that are not stored in standard DB
const generateAttributes = (service) => {
  if (!service) return null;

  const name = service.name || "";
  const id = service._id || "";
  const seed = name + id;

  // Hash helper for deterministic values
  const getSeededValue = (str, array) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % array.length;
    return array[index];
  };

  const basePrice = service.price || 0;
  const ratingVal = service.rating || 4.8;
  const reviewCountVal = service.reviewsCount || getSeededValue(seed + "rev", [28, 45, 89, 124, 256, 412]);

  // Gallery images based on category (use real album from DB if available)
  let gallery = (service.album && service.album.length > 0) ? service.album : [];
  if (gallery.length === 0) {
    if (service.category === "nha_hang") {
      gallery = [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=600",
        "https://images.unsplash.com/photo-1507504038482-7621c51b3050?q=80&w=600"
      ];
    } else if (service.category === "chup_anh") {
      gallery = [
        "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600",
        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=600"
      ];
    } else if (service.category === "trang_diem") {
      gallery = [
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600",
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600"
      ];
    } else if (service.category === "xe_hoa") {
      gallery = [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=600",
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600",
        "https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?q=80&w=600"
      ];
    } else {
      gallery = [
        "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=600",
        "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=600",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600"
      ];
    }
  }

  // Pros & Cons
  const pros = getSeededValue(seed + "pros", [
    ["Không gian sang trọng bậc nhất", "Thực đơn tiệc phong phú cực ngon", "Đội ngũ phục vụ chuyên nghiệp tận tâm"],
    ["Chụp ảnh bắt trọn khoảnh khắc nghệ thuật", "Nhiều ưu đãi album kèm theo", "Bàn giao sản phẩm đúng cam kết"],
    ["Mỹ phẩm chính hãng cao cấp từ Pháp", "Phong cách trang điểm trong suốt tự nhiên", "Kèm phụ kiện tóc thiết kế sang chảnh"],
    ["Dòng xe Mercedes/Audi mui trần đời mới", "Tài xế lịch sự, tác phong chuyên nghiệp", "Hỗ trợ trang trí hoa lụa cao cấp miễn phí"],
    ["Mẫu váy cưới cao cấp thiết kế độc quyền", "Không giới hạn số lần thử váy", "Hỗ trợ chỉnh sửa số đo nhanh chóng"]
  ]);

  const cons = getSeededValue(seed + "cons", [
    ["Phụ thu phí phục vụ tiệc vào dịp cuối tuần", "Chỗ đậu xe ô tô giờ cao điểm hơi chật"],
    ["Phụ thu phí đi lại khi chụp ngoại tỉnh", "Lịch trống các tháng mùa cưới rất hạn chế"],
    ["Cần đặt trước dịch vụ ít nhất 1 tháng", "Phụ thu trang điểm tại nhà trước 5h sáng"],
    ["Phí trội giờ thêm tương đối cao", "Chỉ phục vụ đưa đón khu vực nội thành"],
    ["Yêu cầu đặt cọc giữ váy tương đối lớn", "Hạn chế thay đổi kiểu dáng sát ngày cưới"]
  ]);

  // Ratings Detail
  const ratingsDetail = {
    overall: ratingVal,
    food: getSeededValue(seed + "food", [4.8, 4.6, 4.4, 4.7, 4.9]),
    decor: getSeededValue(seed + "decor", [4.7, 4.5, 4.8, 4.6, 4.9]),
    service: getSeededValue(seed + "service", [4.6, 4.7, 4.5, 4.8, 4.9]),
    staff: getSeededValue(seed + "staff", [4.8, 4.7, 4.6, 4.5, 4.9]),
    cleanliness: getSeededValue(seed + "clean", [4.9, 4.8, 4.7, 4.6, 4.5]),
    value: getSeededValue(seed + "val", [4.5, 4.6, 4.7, 4.8, 4.4])
  };

  // AI Recommendation tag
  const aiRecommendation = getSeededValue(seed + "airec", [
    "Dành cho đám cưới xa hoa: Không gian và dịch vụ chuẩn Luxury hoàn hảo cho số lượng khách lớn.",
    "Lựa chọn tối ưu ngân sách: Đầy đủ dịch vụ tiện ích với mức giá vô cùng hợp lý và chất lượng tuyệt vời.",
    "Phù hợp với sự chỉn chu: Đội ngũ chuyên nghiệp tận tâm, hoàn hảo cho những tiệc cưới đòi hỏi khắt khe.",
    "Phong cách truyền thống: Thiết kế và dịch vụ mang đậm văn hóa cưới truyền thống của Việt Nam.",
    "Tiệc cưới lãng mạn ngoài trời: Thích hợp nhất cho các buổi tiệc sân vườn hoặc chụp ảnh phong cách thiên nhiên."
  ]);

  // Reviews timeline
  const reviews = [
    {
      id: "rev1",
      author: getSeededValue(seed + "aut1", ["Nguyễn Minh Anh", "Lê Thu Hà", "Trần Tiến Đạt"]),
      date: "12/05/2026",
      rating: 5.0,
      content: "Trải nghiệm vô cùng tuyệt vời! Dịch vụ chuẩn 5 sao, đội ngũ hỗ trợ tận tình đến tận phút cuối cùng. Rất xứng đáng với chi phí bỏ ra.",
      verified: true,
      helpful: 12,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100"
    },
    {
      id: "rev2",
      author: getSeededValue(seed + "aut2", ["Hoàng Quốc Bảo", "Phan Thanh Vân", "Vũ Mai Chi"]),
      date: "28/04/2026",
      rating: 4.8,
      content: "Mọi thứ đều hoàn hảo từ khâu chuẩn bị đến thực hiện. Dù liên hệ sát ngày nhưng ekip vẫn phản hồi nhanh chóng và chuẩn bị rất chu đáo.",
      verified: true,
      helpful: 8,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"
    }
  ];

  const compAttr = service.comparisonAttributes || {};

  const common = {
    id: service._id,
    name: service.name,
    category: service.category,
    categoryName: service.category === "nha_hang" ? "Sảnh tiệc cưới" :
                  service.category === "trang_diem" ? "Trang điểm cô dâu" :
                  service.category === "xe_hoa" ? "Xe hoa ngày cưới" :
                  service.category === "chup_anh" ? "Chụp ảnh cưới" : "Thuê váy & vest cưới",
    providerName: compAttr.providerName || (service.vendor?.name) || getSeededValue(seed + "vendor", ["An Wedding Premium", "Gia Đình Việt Planner", "Happy Day Studio", "Luxury Wedding Organizer", "ROYAL Wedding Decor"]),
    imageUrl: service.image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    location: service.location || "Quận 1, TP. HCM",
    address: service.address || "Chưa cập nhật",
    basePrice: basePrice,
    minPrice: compAttr.minPrice ? Number(compAttr.minPrice) : (basePrice * 0.9),
    maxPrice: compAttr.maxPrice ? Number(compAttr.maxPrice) : (basePrice * 1.3),
    rating: ratingVal,
    reviewCount: reviewCountVal,
    status: compAttr.status || getSeededValue(seed + "status", ["Đang nhận lịch", "Còn trống ít ngày", "Hết lịch tháng này"]),
    promotion: service.badge || compAttr.promotion || getSeededValue(seed + "promo", ["Giảm 10% gói cưới", "Tặng cổng hoa tươi", "Tặng album cưới mini", "Tặng Voucher giảm 2.000.000đ"]),
    depositPolicy: compAttr.depositPolicy || getSeededValue(seed + "deposit", ["Đặt cọc trước 30% để giữ ngày", "Đặt cọc trước 50%", "Đặt cọc trước 20%"]),
    cancellationPolicy: compAttr.cancellationPolicy || getSeededValue(seed + "cancel", ["Hủy trước 30 ngày hoàn cọc 100%", "Hủy trước 15 ngày hoàn cọc 50%", "Không hoàn cọc khi hủy"]),
    responseTime: compAttr.responseTime || getSeededValue(seed + "response", ["Dưới 15 phút", "Trong vòng 1 giờ", "Trong vòng 2 giờ", "Trong vòng 24 giờ"]),
    includedServices: service.includedServices && service.includedServices.length > 0 
      ? service.includedServices.join(", ") 
      : (compAttr.includedServices || getSeededValue(seed + "inc", [
          "Tư vấn kịch bản cưới hỏi, Nhân sự kỹ thuật hỗ trợ, Âm thanh ánh sáng sân khấu cơ bản",
          "Trọn gói chuẩn bị, Dặm phấn nhẹ trước giờ đón khách, Làm tóc cơ bản",
          "Tài xế chuyên nghiệp lái xe, Xăng xe nội thành dưới 50km, Trang trí hoa lụa cao cấp",
          "Hỗ trợ chỉnh sửa toàn bộ ảnh, Tặng kèm album photobook, Ekip 2 nhiếp ảnh gia",
          "Hỗ trợ chỉnh sửa số đo váy cưới, Cho thuê 3 ngày, Kèm trang sức voan cưới cô dâu"
        ])),
    notes: service.description || compAttr.notes || "Dịch vụ cưới hỏi chất lượng cao, mang lại trải nghiệm tuyệt vời cho ngày hạnh phúc của bạn.",
    pros,
    cons,
    ratingsDetail,
    aiRecommendation,
    reviews,
    gallery
  };

  let specific = {};

  if (service.category === "nha_hang") {
    specific = {
      capacity: service.capacity ? `${service.capacity} khách` : (compAttr.capacity ? (compAttr.capacity.includes("khách") ? compAttr.capacity : `${compAttr.capacity} khách`) : getSeededValue(seed + "cap", ["300 khách", "450 khách", "600 khách", "800 khách"])),
      minTables: compAttr.minTables || getSeededValue(seed + "mintab", ["15 bàn", "20 bàn", "25 bàn", "30 bàn"]),
      pricePerTable: service.priceLabel || compAttr.pricePerTable || `${(basePrice / 10).toLocaleString('vi-VN')}đ/bàn`,
      sampleMenu: compAttr.sampleMenu || getSeededValue(seed + "menu", ["Thực đơn Á-Âu 6 món", "Thực đơn thuần Việt 7 món", "Thực đơn Seafood cao cấp 6 món"]),
      hallType: compAttr.hallType || getSeededValue(seed + "hall", ["Trong nhà & Ngoài trời", "Sảnh tiệc máy lạnh", "Sân vườn ngoài trời"]),
      stage: compAttr.stage || getSeededValue(seed + "stage", ["Có sẵn, cao 0.8m, rộng 20m2", "Có sẵn, thiết kế di động", "Thiết kế theo yêu cầu"]),
      soundLighting: compAttr.soundLighting || getSeededValue(seed + "sound", ["Đèn LED màu, loa JBL chuyên nghiệp", "Hệ thống âm thanh sân khấu tiêu chuẩn", "Hệ thống cao cấp chuẩn phòng trà"]),
      parking: compAttr.parking || getSeededValue(seed + "park", ["Bãi đỗ xe ô tô & xe máy rộng rãi miễn phí", "Có chỗ đậu ô tô, có thu phí", "Bãi xe máy rộng, ô tô gửi lân cận"]),
      serviceFee: compAttr.serviceFee || getSeededValue(seed + "fee", ["Đã bao gồm trong giá bàn", "5% phí dịch vụ", "10% phí phục vụ và VAT"]),
      eventDuration: compAttr.eventDuration || getSeededValue(seed + "dur", ["4 tiếng", "5 tiếng", "Trọn gói ngày cưới"]),
      decorationIncluded: compAttr.decorationIncluded || getSeededValue(seed + "decor", ["Cổng hoa tươi, backdrop sân khấu", "Hoa tươi bàn tiệc và lối đi", "Trang trí bong bóng & hoa lụa cao cấp"])
    };
  } else if (service.category === "trang_diem") {
    specific = {
      packageType: compAttr.packageType || getSeededValue(seed + "pack", ["Gói Makeup Ăn hỏi & Ngày cưới", "Gói VIP (kèm dặm phấn suốt tiệc)", "Gói Trang điểm & Làm tóc cơ bản"]),
      makeupStyle: compAttr.makeupStyle || getSeededValue(seed + "style", ["Hàn Quốc trong trẻo, tự nhiên", "Tây Âu sắc sảo, sang trọng", "Thái Lan ngọt ngào, quyến rũ"]),
      trialMakeup: compAttr.trialMakeup || getSeededValue(seed + "trial", ["Có hỗ trợ trang điểm thử trước cưới", "Có phí ưu đãi 50% khi trang điểm thử", "Không hỗ trợ trang điểm thử"]),
      hairStylingIncluded: compAttr.hairStylingIncluded || getSeededValue(seed + "hair", ["Làm tóc đi kèm phù hợp gương mặt & váy", "Có kèm phụ kiện tóc", "Làm tóc cơ bản (không phụ kiện)"]),
      duration: compAttr.duration || getSeededValue(seed + "dur", ["90 phút", "120 phút", "150 phút"]),
      homeService: compAttr.homeService || getSeededValue(seed + "home", ["Có hỗ trợ làm tại nhà (miễn phí nội thành)", "Hỗ trợ làm tại nhà (có phụ phí di chuyển)", "Chỉ làm tại tiệm"]),
      assistantCount: compAttr.assistantCount || getSeededValue(seed + "assist", ["1 chuyên viên chính + 1 trợ lý", "Chỉ 1 chuyên viên chính", "2 trợ lý hỗ trợ làm tóc"]),
      cosmeticsBrand: compAttr.cosmeticsBrand || getSeededValue(seed + "cos", ["Chanel, Dior, YSL, MAC", "Estee Lauder, Tom Ford, NARS", "Shiseido, Clé de Peau, Make Up For Ever"]),
      travelFee: compAttr.travelFee || getSeededValue(seed + "travel", ["Miễn phí dưới 10km, sau đó 15.000đ/km", "Tính phí di chuyển thực tế theo Grab", "Hỗ trợ 50% phí di chuyển ngoại tỉnh"]),
      bookingAdvanceTime: compAttr.bookingAdvanceTime || getSeededValue(seed + "adv", ["Đặt trước 1-2 tháng", "Đặt trước 2-3 tuần", "Có nhận lịch gấp trước 5 ngày"])
    };
  } else if (service.category === "xe_hoa") {
    specific = {
      carType: compAttr.carType || getSeededValue(seed + "cartype", ["Mui trần thể thao", "Sedan hạng sang", "Xe cổ điển lãng mạn", "SUV cao cấp"]),
      carModel: compAttr.carModel || getSeededValue(seed + "carmodel", ["Mercedes C300 Cabriolet", "BMW 420i Gran Coupe", "Audi A6 Luxury", "Volkswagen Beetle Cổ"]),
      carColor: compAttr.carColor || getSeededValue(seed + "color", ["Trắng tinh khôi", "Đỏ may mắn", "Đen sang trọng", "Vàng cát quý phái"]),
      rentalDuration: compAttr.rentalDuration || getSeededValue(seed + "dur", ["4 tiếng (Nội thành)", "8 tiếng (Ngoại thành)", "Trọn gói ngày cưới"]),
      kmLimit: compAttr.kmLimit || getSeededValue(seed + "kmlim", ["Giới hạn 50km", "Giới hạn 100km", "Không giới hạn km"]),
      driverIncluded: compAttr.driverIncluded || getSeededValue(seed + "driver", ["Có tài xế riêng lịch sự, mặc vest", "Tài xế chuyên nghiệp am hiểu đường sá", "Cho thuê tự lái (yêu cầu cọc cao)"]),
      flowerDecoration: compAttr.flowerDecoration || getSeededValue(seed + "flower", ["Có kèm hoa lụa cao cấp", "Hỗ trợ hoa tươi thiết kế riêng (+1.000.000đ)", "Chưa bao gồm hoa trang trí"]),
      overtimeFee: compAttr.overtimeFee || getSeededValue(seed + "ot", ["300.000đ/giờ", "400.000đ/giờ", "500.000đ/giờ"]),
      extraKmFee: compAttr.extraKmFee || getSeededValue(seed + "ekm", ["15.000đ/km", "20.000đ/km", "25.000đ/km"]),
      serviceArea: compAttr.serviceArea || getSeededValue(seed + "area", ["Nội thành TP.HCM/Hà Nội", "Toàn miền Bắc / miền Nam", "Nội tỉnh dưới 150km"]),
      depositCondition: compAttr.depositCondition || getSeededValue(seed + "depcond", ["Không giữ giấy tờ, cọc 2.000.000đ", "Ký hợp đồng cọc 30%", "Giữ CCCD và cọc 5.000.000đ"])
    };
  } else if (service.category === "chup_anh") {
    specific = {
      packageType: compAttr.packageType || getSeededValue(seed + "pack", ["Gói chụp Ngoại cảnh & Studio", "Gói Phóng sự ngày cưới (2 máy)", "Gói Pre-wedding cao cấp"]),
      photographyStyle: compAttr.photographyStyle || getSeededValue(seed + "style", ["Cảm xúc tự nhiên, Cinematic", "Hàn Quốc nhẹ nhàng, lãng mạn", "Cổ điển Vintage hoài niệm", "Fine Art nghệ thuật"]),
      shootingDuration: compAttr.shootingDuration || getSeededValue(seed + "dur", ["6-8 tiếng", "8-10 tiếng", "Trọn ngày cưới"]),
      photographerCount: compAttr.photographerCount || getSeededValue(seed + "photocount", ["2 thợ chụp chính", "1 thợ chụp chính + 1 thợ phụ", "2 chụp chính + 1 quay phim"]),
      editedPhotos: compAttr.editedPhotos || getSeededValue(seed + "edited", ["45 ảnh chỉnh sửa cao cấp", "60 ảnh chỉnh sửa thiết kế album", "100 ảnh chỉnh sửa hoàn thiện"]),
      rawPhotos: compAttr.rawPhotos || getSeededValue(seed + "raw", ["Trả toàn bộ ảnh gốc (>1000 file)", "Trả toàn bộ ảnh gốc (>800 file)", "Hỗ trợ chọn ảnh gốc chất lượng cao"]),
      videoIncluded: compAttr.videoIncluded || getSeededValue(seed + "vid", ["Có (Quay phim phóng sự cưới)", "Không kèm quay phim (chỉ chụp ảnh)", "Có (Quay phim truyền thống)"]),
      highlightVideo: compAttr.highlightVideo || getSeededValue(seed + "hlvid", ["Có video highlight 3-5 phút chất lượng 4K", "Có video highlight 2-3 phút", "Không có video highlight"]),
      albumIncluded: compAttr.albumIncluded || getSeededValue(seed + "album", ["1 Album Photobook 30x30cm (30 trang)", "1 Album da cao cấp 25x35cm", "2 Album mini bỏ túi"]),
      shootingLocation: compAttr.shootingLocation || getSeededValue(seed + "loc", ["1 điểm ngoại cảnh + Studio", "Nội thành hoặc ngoại cảnh tùy chọn", "Chụp tại phim trường độc quyền"]),
      deliveryTime: compAttr.deliveryTime || getSeededValue(seed + "deliv", ["20 ngày", "30 ngày", "15 ngày"]),
      travelFee: compAttr.travelFee || getSeededValue(seed + "travel", ["Đã bao gồm chi phí di chuyển", "Chưa bao gồm vé vào cổng phim trường", "Khách tự chi trả đi lại của ekip"]),
      deliveryDaysNum: compAttr.deliveryDaysNum !== undefined ? Number(compAttr.deliveryDaysNum) : getSeededValue(seed + "delivnum", [20, 30, 15])
    };
  } else if (service.category === "vay_cuoi") {
    specific = {
      outfitType: compAttr.outfitType || getSeededValue(seed + "outtype", ["Váy cưới dòng Luxury & Vest", "Váy cưới thiết kế riêng", "2 Váy cưới + 1 Vest chú rể"]),
      outfitQuantity: compAttr.outfitQuantity || getSeededValue(seed + "qty", ["2 váy cưới + 1 bộ vest", "1 váy cưới cao cấp", "3 váy cưới + 2 bộ vest"]),
      rentalDuration: compAttr.rentalDuration || getSeededValue(seed + "dur", ["3 ngày (72 giờ)", "2 ngày (48 giờ)", "4 ngày để đi tỉnh"]),
      fittingAvailable: compAttr.fittingAvailable || getSeededValue(seed + "fit", ["Thử đồ không giới hạn số lượng", "Hỗ trợ thử tối đa 5 váy", "Hỗ trợ thử đồ trước ngày cưới 1 tuần"]),
      sizeAdjustment: compAttr.sizeAdjustment || getSeededValue(seed + "sizeadj", ["Có hỗ trợ chỉnh sửa theo số đo cô dâu", "Sửa size cơ bản miễn phí", "Không hỗ trợ sửa size"]),
      cleaningFee: compAttr.cleaningFee || getSeededValue(seed + "clean", ["Miễn phí giặt ủi sau khi trả váy", "Đã bao gồm phí hấp sấy", "Phụ phí giặt ủi 200.000đ/váy rách dơ nặng"]),
      depositAmount: compAttr.depositAmount || getSeededValue(seed + "depamt", ["Cọc 50% giá trị váy thuê", "Cọc CCCD hoặc 5.000.000đ", "Không cần đặt cọc tiền mặt (giữ giấy tờ)"]),
      damagePolicy: compAttr.damagePolicy || getSeededValue(seed + "dmg", ["Đền bù 10-30% nếu hỏng nhẹ, 100% nếu hỏng nặng", "Hỗ trợ bảo hiểm váy rách nhẹ", "Khách tự đền bù theo bảng giá sửa chữa"]),
      availableSizes: compAttr.availableSizes || getSeededValue(seed + "sizes", ["S, M, L (dây cột sau lưng co giãn)", "May đo theo yêu cầu", "Hỗ trợ từ size XS đến XXL"]),
      accessoriesIncluded: compAttr.accessoriesIncluded || getSeededValue(seed + "access", ["Kèm voan cài đầu, trang sức, tùng váy", "Có kèm trang sức và vương miện", "Chỉ kèm voan cài đầu tiêu chuẩn"]),
      extraDayFee: compAttr.extraDayFee || getSeededValue(seed + "extrafee", ["500.000đ/ngày", "800.000đ/ngày", "10% giá trị gói/ngày"])
    };
  }

  return {
    ...common,
    ...specific
  };
};

const ComparePage = () => {
  const navigate = useNavigate();
  const [currentCategory, setCurrentCategory] = useState("nha_hang");
  
  // List of loaded services in current category
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Redesigned Comparison States
  const [selectedServices, setSelectedServices] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 150000000,
    location: "",
    rating: "",
    status: ""
  });

  // Favorites state
  const [favorites, setFavorites] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  // Real reviews state
  const [realReviews, setRealReviews] = useState({});

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    const stored = localStorage.getItem("wedding_favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Fetch services when category changes
  useEffect(() => {
    setLoading(true);
    setSelectedServices([]);
    setIsComparing(false);
    setSearchQuery("");
    setRealReviews({}); // Reset real reviews
    setFilters({
      priceMin: 0,
      priceMax: 150000000,
      location: "",
      rating: "",
      status: ""
    });

    fetch(`${API_URL}/api/services?category=${currentCategory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách dịch vụ");
        return res.json();
      })
      .then((data) => {
        const enriched = (data || []).map(s => generateAttributes(s));
        setServices(enriched);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setServices([]);
        setLoading(false);
      });
  }, [currentCategory]);

  // Fetch real reviews for selected services
  useEffect(() => {
    if (selectedServices.length === 0) {
      setRealReviews({});
      return;
    }

    selectedServices.forEach(s => {
      if (!realReviews[s.id]) {
        fetch(`${API_URL}/api/reviews?serviceId=${s.id}`)
          .then(res => res.json())
          .then(data => {
            setRealReviews(prev => ({
              ...prev,
              [s.id]: data || []
            }));
          })
          .catch(err => {
            console.error("Error fetching reviews for service:", s.id, err);
            setRealReviews(prev => ({
              ...prev,
              [s.id]: []
            }));
          });
      }
    });
  }, [selectedServices]);

  const handleCategoryChange = (catId) => {
    setCurrentCategory(catId);
  };

  // Toggle select service to compare
  const toggleCompare = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      if (selectedServices.length >= 3) {
        showToast("Bạn chỉ có thể so sánh tối đa 3 dịch vụ cùng lúc.");
        return;
      }
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const removeSelectedService = (id) => {
    setSelectedServices(prev => prev.filter(s => s.id !== id));
  };

  // Toggle favorite helper
  const toggleFavorite = (serviceId, e) => {
    if (e) e.stopPropagation();
    let updated;
    if (favorites.includes(serviceId)) {
      updated = favorites.filter((id) => id !== serviceId);
      showToast("Đã xóa khỏi danh sách yêu thích");
    } else {
      updated = [...favorites, serviceId];
      showToast("Đã thêm vào danh sách yêu thích!");
    }
    setFavorites(updated);
    localStorage.setItem("wedding_favorites", JSON.stringify(updated));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleBookConsultation = (serviceName, e) => {
    if (e) e.stopPropagation();
    showToast(`Đã gởi yêu cầu tư vấn cho "${serviceName}"! Chúng tôi sẽ phản hồi sớm nhất.`);
  };

  const handleSelectServiceDirect = (serviceId, servicePrice, serviceCategory, serviceName, e) => {
    if (e) e.stopPropagation();
    showToast("Đang chuyển hướng đến trang đặt lịch...");
    setTimeout(() => {
      navigate("/booking", {
        state: {
          serviceId,
          serviceName,
          category: serviceCategory,
          amount: servicePrice,
          selectedPackages: "Đặt trực tiếp từ So sánh"
        }
      });
    }, 1200);
  };

  // Format Helpers
  const formatPrice = (price) => {
    if (!price) return "Chưa cập nhật";
    return price.toLocaleString("vi-VN") + "đ";
  };

  // Filter & Search Logic
  const filteredServices = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPrice = s.basePrice >= filters.priceMin && s.basePrice <= filters.priceMax;
    const matchesLocation = filters.location ? s.location.includes(filters.location) : true;
    const matchesRating = filters.rating ? s.rating >= parseFloat(filters.rating) : true;
    const matchesStatus = filters.status ? s.status === filters.status : true;

    return matchesSearch && matchesPrice && matchesLocation && matchesRating && matchesStatus;
  });

  // Extract unique locations for filtering
  const locations = Array.from(new Set(services.map(s => s.location.split(",").pop().trim()))).filter(Boolean);

  return (
    <div className={styles.comparePage}>
      <SharedHeader theme="light" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>✨ {toastMessage}</span>
        </div>
      )}

      <main className={styles.mainContainer}>
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <span className={styles.badge}>✨ So sánh tối đa 3 dịch vụ</span>
          <h1 className={styles.heroTitle}>So Sánh Dịch Vụ Cưới</h1>
          <p className={styles.heroSubtitle}>
            Tìm kiếm, đối chiếu chi phí, đánh giá và thông số kỹ thuật của các nhà cung cấp tiệc cưới cao cấp hàng đầu trước khi đưa ra quyết định đặt lịch.
          </p>
        </section>

        {!isComparing ? (
          <>
            {/* Category Selector Chips */}
            <section className={styles.categorySelector}>
              <div className={styles.chipsScroll}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={[
                      styles.chipBtn,
                      currentCategory === cat.id ? styles.chipBtnActive : ""
                    ].join(" ")}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    <span className={styles.chipIcon}>{cat.icon}</span>
                    <span className={styles.chipName}>{cat.name}</span>
                    {currentCategory === cat.id && <span className={styles.chipDot} />}
                  </button>
                ))}
              </div>
            </section>

            {/* Search & Filter Toolbar */}
            <section className={styles.toolbarSection}>
              <div className={styles.searchBar}>
                <span className={styles.searchIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm nhà cung cấp, địa điểm, từ khóa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                {searchQuery && (
                  <button className={styles.clearSearch} onClick={() => setSearchQuery("")}>✕</button>
                )}
              </div>

              <button
                className={[styles.filterToggleBtn, showFilterPanel ? styles.filterActive : ""].join(" ")}
                onClick={() => setShowFilterPanel(!showFilterPanel)}
              >
                <span>🎛️ Bộ lọc nâng cao</span>
                <span className={styles.arrowIcon}>{showFilterPanel ? "▲" : "▼"}</span>
              </button>
            </section>

            {/* Expandable Filter Panel */}
            {showFilterPanel && (
              <section className={styles.filterPanel}>
                <div className={styles.filterGrid}>
                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Khoảng giá tối đa</label>
                    <div className={styles.rangeWrapper}>
                      <input
                        type="range"
                        min="0"
                        max="150000000"
                        step="5000000"
                        value={filters.priceMax}
                        onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
                        className={styles.rangeInput}
                      />
                      <span className={styles.rangeVal}>Dưới {formatPrice(filters.priceMax)}</span>
                    </div>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Khu vực / Tỉnh thành</label>
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className={styles.filterSelect}
                    >
                      <option value="">Tất cả khu vực</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Đánh giá tối thiểu</label>
                    <select
                      value={filters.rating}
                      onChange={(e) => setFilters(prev => ({ ...prev, rating: e.target.value }))}
                      className={styles.filterSelect}
                    >
                      <option value="">Tất cả đánh giá</option>
                      <option value="4.8">⭐️ 4.8 sao trở lên</option>
                      <option value="4.5">⭐️ 4.5 sao trở lên</option>
                      <option value="4.0">⭐️ 4.0 sao trở lên</option>
                    </select>
                  </div>

                  <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>Trạng thái đặt chỗ</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className={styles.filterSelect}
                    >
                      <option value="">Tất cả trạng thái</option>
                      <option value="Đang nhận lịch">Đang nhận lịch</option>
                      <option value="Còn trống ít ngày">Còn trống ít ngày</option>
                      <option value="Hết lịch tháng này">Hết lịch tháng này</option>
                    </select>
                  </div>
                </div>
                <button
                  className={styles.resetFiltersBtn}
                  onClick={() => setFilters({
                    priceMin: 0,
                    priceMax: 150000000,
                    location: "",
                    rating: "",
                    status: ""
                  })}
                >
                  Xóa bộ lọc
                </button>
              </section>
            )}

            {/* Service Grid List */}
            {loading ? (
              <section className={styles.loadingSection}>
                <div className={styles.spinner} />
                <p>Đang quét danh sách nhà cung cấp cưới cao cấp...</p>
              </section>
            ) : filteredServices.length === 0 ? (
              <section className={styles.emptyBrowseState}>
                <div className={styles.emptyBrowseIcon}>🍃</div>
                <h3>Không tìm thấy dịch vụ phù hợp</h3>
                <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm khác để nhận được kết quả tốt hơn.</p>
              </section>
            ) : (
              <section className={styles.serviceGrid}>
                {filteredServices.map((service) => {
                  const isSelected = selectedServices.some(s => s.id === service.id);
                  const isFav = favorites.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      className={[
                        styles.serviceCard,
                        isSelected ? styles.cardSelected : ""
                      ].join(" ")}
                      onClick={() => toggleCompare(service)}
                    >
                      {/* Card Cover */}
                      <div className={styles.cardImageArea}>
                        <img src={service.imageUrl} alt={service.name} className={styles.cardCoverImg} />
                        <button
                          className={[styles.favBtn, isFav ? styles.favBtnActive : ""].join(" ")}
                          onClick={(e) => toggleFavorite(service.id, e)}
                        >
                          {isFav ? "❤️" : "🤍"}
                        </button>
                        {service.status && (
                          <span className={styles.statusLabel}>{service.status}</span>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className={styles.cardContent}>
                        <div className={styles.vendorRow}>
                          <span className={styles.vendorName}>{service.providerName}</span>
                          <span className={styles.ratingBadge}>
                            ★ {service.rating.toFixed(1)} <span>({service.reviewCount})</span>
                          </span>
                        </div>
                        <h3 className={styles.serviceNameTitle}>{service.name}</h3>
                        <p className={styles.locationText}>📍 {service.location}</p>

                        {service.capacity && (
                          <p className={styles.capacityText}>👥 Sức chứa: {service.capacity}</p>
                        )}

                        <div className={styles.cardDivider} />

                        <div className={styles.priceRow}>
                          <div className={styles.priceLabelCol}>
                            <span className={styles.startingPriceLabel}>Giá khởi điểm</span>
                            <span className={styles.priceValue}>{formatPrice(service.basePrice)}</span>
                          </div>

                          <button
                            className={[
                              styles.compareCheckBtn,
                              isSelected ? styles.compareCheckBtnSelected : ""
                            ].join(" ")}
                          >
                            {isSelected ? "✓ Đã chọn" : "+ So sánh"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>
            )}

            {/* Bottom Sticky Compare Bar */}
            {selectedServices.length > 0 && (
              <div className={styles.stickyCompareBar}>
                <div className={styles.compareBarContainer}>
                  <div className={styles.compareBarLeft}>
                    <span className={styles.compareCount}>
                      Đã chọn <strong>{selectedServices.length}</strong>/3 dịch vụ
                    </span>
                    <div className={styles.compareThumbnails}>
                      {selectedServices.map(s => (
                        <div key={s.id} className={styles.thumbWrapper}>
                          <img src={s.imageUrl} alt={s.name} className={styles.thumbImg} />
                          <button className={styles.removeThumb} onClick={(e) => {
                            e.stopPropagation();
                            removeSelectedService(s.id);
                          }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.compareBarRight}>
                    <button
                      className={styles.clearAllBtn}
                      onClick={() => setSelectedServices([])}
                    >
                      Xóa hết
                    </button>
                    <button
                      className={styles.compareNowBtn}
                      disabled={selectedServices.length < 2}
                      onClick={() => setIsComparing(true)}
                    >
                      So sánh ngay ({selectedServices.length})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Redesigned Apple Style Comparison View */
          <section className={styles.comparisonDashboard}>
            {/* Header / Nav Control */}
            <div className={styles.comparisonHeader}>
              <button className={styles.backBtn} onClick={() => setIsComparing(false)}>
                ← Quay lại lựa chọn dịch vụ
              </button>
              <h2 className={styles.comparisonDashboardTitle}>So sánh đối chiếu chi tiết</h2>
            </div>

            {/* Apple Style Comparison Grid */}
            <div className={styles.comparisonGridContainer}>
              {/* Column 1: Header Labels */}
              <div className={styles.criteriaLabelsColumn}>
                <div className={styles.stickyHeaderSpacer} />
                
                {/* Accordion 1: Tổng quan */}
                <div className={styles.sectionLabelTitle}>📌 TỔNG QUAN</div>
                <div className={styles.labelRow}>Nhà cung cấp</div>
                <div className={styles.labelRow}>Địa điểm</div>
                <div className={styles.labelRow}>Phản hồi</div>
                
                {/* Accordion 2: Chi phí */}
                <div className={styles.sectionLabelTitle}>💰 GIÁ CẢ & CHÍNH SÁCH</div>
                <div className={styles.labelRow}>Giá cọc giữ ngày</div>
                <div className={styles.labelRow}>Chính sách hủy</div>
                <div className={styles.labelRow}>Khuyến mãi</div>

                {/* Accordion 3: Tiện ích chi tiết */}
                <div className={styles.sectionLabelTitle}>🛠️ THÔNG SỐ CHI TIẾT</div>
                {currentCategory === "nha_hang" && (
                  <>
                    <div className={styles.labelRow}>Sức chứa</div>
                    <div className={styles.labelRow}>Bàn tối thiểu</div>
                    <div className={styles.labelRow}>Thực đơn tiệc</div>
                    <div className={styles.labelRow}>Bãi đỗ xe</div>
                    <div className={styles.labelRow}>Phí phục vụ</div>
                  </>
                )}
                {currentCategory === "trang_diem" && (
                  <>
                    <div className={styles.labelRow}>Loại gói</div>
                    <div className={styles.labelRow}>Hỗ trợ tại nhà</div>
                    <div className={styles.labelRow}>Hãng mỹ phẩm</div>
                    <div className={styles.labelRow}>Dặm phấn thử</div>
                  </>
                )}
                {currentCategory === "xe_hoa" && (
                  <>
                    <div className={styles.labelRow}>Mẫu xe cưới</div>
                    <div className={styles.labelRow}>Màu sắc xe</div>
                    <div className={styles.labelRow}>Tài xế đi kèm</div>
                    <div className={styles.labelRow}>Trang trí hoa xe</div>
                  </>
                )}
                {currentCategory === "chup_anh" && (
                  <>
                    <div className={styles.labelRow}>Phong cách chụp</div>
                    <div className={styles.labelRow}>Sản phẩm bàn giao</div>
                    <div className={styles.labelRow}>Thời gian trả ảnh</div>
                    <div className={styles.labelRow}>Kèm quay video</div>
                  </>
                )}
                {currentCategory === "vay_cuoi" && (
                  <>
                    <div className={styles.labelRow}>Gói váy cưới</div>
                    <div className={styles.labelRow}>Chỉnh sửa số đo</div>
                    <div className={styles.labelRow}>Thời gian giữ đồ</div>
                    <div className={styles.labelRow}>Phụ kiện kèm voan</div>
                  </>
                )}

                <div className={styles.sectionLabelTitle}>⭐️ ĐÁNH GIÁ (1 - 5)</div>
                <div className={styles.labelRow}>Điểm tổng quan</div>
                <div className={styles.labelRow}>Phong cách phục vụ</div>
                <div className={styles.labelRow}>Trang trí/Thực tế</div>
                <div className={styles.labelRow}>Giá trị tương ứng</div>

                <div className={styles.sectionLabelTitle}>💡 ĐIỂM CỘNG & ĐIỂM TRỪ</div>
                <div className={`${styles.labelRow} ${styles.tagsLabelRow}`}>Điểm mạnh nổi trội</div>
                <div className={`${styles.labelRow} ${styles.tagsLabelRow}`}>Hạn chế lưu ý</div>
              </div>

              {/* Columns for Selected Services */}
              <div className={styles.columnsScroller}>
                {selectedServices.map((s) => (
                  <div key={s.id} className={styles.serviceColumn}>
                    {/* Sticky Card Header Overview */}
                    <div className={styles.stickyColumnHeader}>
                      <button className={styles.removeColumnBtn} onClick={() => removeSelectedService(s.id)}>✕</button>
                      <img src={s.imageUrl} alt={s.name} className={styles.colCoverImg} />
                      <h3 className={styles.colServiceName}>{s.name}</h3>
                      <div className={styles.colPriceText}>{formatPrice(s.basePrice)}</div>
                      <button
                        className={styles.colBookBtn}
                        onClick={(e) => handleSelectServiceDirect(s.id, s.basePrice, s.category, s.name, e)}
                      >
                        Đặt lịch ngay
                      </button>
                    </div>

                    {/* Overview Values */}
                    <div className={styles.valueTitleGroupMobile}>📌 TỔNG QUAN</div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Nhà cung cấp: </span>
                      {s.providerName}
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Địa điểm: </span>
                      {s.location}
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Phản hồi: </span>
                      {s.responseTime}
                    </div>

                    {/* Pricing Values */}
                    <div className={styles.valueTitleGroupMobile}>💰 GIÁ CẢ & CHÍNH SÁCH</div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Giá cọc giữ ngày: </span>
                      {s.depositPolicy}
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Chính sách hủy: </span>
                      {s.cancellationPolicy}
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Khuyến mãi: </span>
                      <span className={styles.highlightBadge}>{s.promotion}</span>
                    </div>

                    {/* Specifications Values */}
                    <div className={styles.valueTitleGroupMobile}>🛠️ THÔNG SỐ CHI TIẾT</div>
                    {currentCategory === "nha_hang" && (
                      <>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Sức chứa: </span>
                          {s.capacity}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Bàn tối thiểu: </span>
                          {s.minTables}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Thực đơn tiệc: </span>
                          {s.sampleMenu}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Bãi đỗ xe: </span>
                          {s.parking}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Phí phục vụ: </span>
                          {s.serviceFee}
                        </div>
                      </>
                    )}
                    {currentCategory === "trang_diem" && (
                      <>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Loại gói: </span>
                          {s.packageType}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Hỗ trợ tại nhà: </span>
                          {s.homeService}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Hãng mỹ phẩm: </span>
                          {s.cosmeticsBrand}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Dặm phấn thử: </span>
                          {s.trialMakeup}
                        </div>
                      </>
                    )}
                    {currentCategory === "xe_hoa" && (
                      <>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Mẫu xe cưới: </span>
                          {s.carModel}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Màu sắc xe: </span>
                          {s.carColor}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Tài xế đi kèm: </span>
                          {s.driverIncluded}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Trang trí hoa xe: </span>
                          {s.flowerDecoration}
                        </div>
                      </>
                    )}
                    {currentCategory === "chup_anh" && (
                      <>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Phong cách chụp: </span>
                          {s.photographyStyle}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Sản phẩm bàn giao: </span>
                          {s.editedPhotos}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Thời gian trả ảnh: </span>
                          {s.deliveryTime}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Kèm quay video: </span>
                          {s.videoIncluded}
                        </div>
                      </>
                    )}
                    {currentCategory === "vay_cuoi" && (
                      <>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Gói váy cưới: </span>
                          {s.outfitType}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Chỉnh sửa số đo: </span>
                          {s.sizeAdjustment}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Thời gian giữ đồ: </span>
                          {s.rentalDuration}
                        </div>
                        <div className={styles.valueRow}>
                          <span className={styles.mobileOnlyLabel}>Phụ kiện kèm voan: </span>
                          {s.accessoriesIncluded}
                        </div>
                      </>
                    )}

                    {/* Ratings with progress bars */}
                    <div className={styles.valueTitleGroupMobile}>⭐️ ĐÁNH GIÁ (1 - 5)</div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Điểm tổng quan: </span>
                      <div className={styles.progressCell}>
                        <span className={styles.scoreText}>{s.ratingsDetail.overall} / 5</span>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${(s.ratingsDetail.overall / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Phong cách phục vụ: </span>
                      <div className={styles.progressCell}>
                        <span className={styles.scoreText}>{s.ratingsDetail.service} / 5</span>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${(s.ratingsDetail.service / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Trang trí/Thực tế: </span>
                      <div className={styles.progressCell}>
                        <span className={styles.scoreText}>{s.ratingsDetail.decor} / 5</span>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${(s.ratingsDetail.decor / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className={styles.valueRow}>
                      <span className={styles.mobileOnlyLabel}>Giá trị tương ứng: </span>
                      <div className={styles.progressCell}>
                        <span className={styles.scoreText}>{s.ratingsDetail.value} / 5</span>
                        <div className={styles.progressBar}>
                          <div className={styles.progressFill} style={{ width: `${(s.ratingsDetail.value / 5) * 100}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Pros and Cons values */}
                    <div className={styles.valueTitleGroupMobile}>💡 ĐIỂM CỘNG & ĐIỂM TRỪ</div>
                    <div className={`${styles.valueRow} ${styles.tagsValueRow}`}>
                      <span className={styles.mobileOnlyLabel}>Điểm mạnh nổi trội: </span>
                      <div className={styles.tagGroup}>
                        {s.pros.map((p, idx) => (
                          <span key={idx} className={styles.proTag}>✓ {p}</span>
                        ))}
                      </div>
                    </div>
                    <div className={`${styles.valueRow} ${styles.tagsValueRow}`}>
                      <span className={styles.mobileOnlyLabel}>Hạn chế lưu ý: </span>
                      <div className={styles.tagGroup}>
                        {s.cons.map((c, idx) => (
                          <span key={idx} className={styles.conTag}>✕ {c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Horizontal Grid */}
            <section className={styles.galleryComparisonSection}>
              <h3 className={styles.subDashboardTitle}>🎞️ Album hình ảnh thực tế</h3>
              <div className={styles.galleryScrollGrid}>
                {selectedServices.map(s => (
                  <div key={s.id} className={styles.galleryCol}>
                    <h4>{s.name}</h4>
                    <div className={styles.galleryRow}>
                      {s.gallery.map((imgUrl, idx) => (
                        <img key={idx} src={imgUrl} alt={`${s.name} preview`} className={styles.galleryPreviewImg} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Modern Review Timeline */}
            <section className={styles.timelineReviewsSection}>
              <h3 className={styles.subDashboardTitle}>💬 Phản hồi của các cặp đôi đi trước</h3>
              <div className={styles.timelineContainer}>
                {selectedServices.map(s => (
                  <div key={s.id} className={styles.timelineCol}>
                    <h4 className={styles.timelineColTitle}>{s.name}</h4>
                    {(() => {
                      const serviceReviews = realReviews[s.id];
                      if (!serviceReviews) {
                        return <p style={{ fontSize: 13, color: '#7a7a7a', fontStyle: 'italic', padding: '10px 0' }}>Đang tải phản hồi...</p>;
                      }
                      if (serviceReviews.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '20px 10px', color: '#7a7a7a' }}>
                            <span style={{ fontSize: '24px' }}>💬</span>
                            <p style={{ fontSize: 13, margin: '8px 0 0' }}>Chưa có phản hồi nào cho dịch vụ này.</p>
                          </div>
                        );
                      }
                      return serviceReviews.map(r => (
                        <div key={r._id || r.id} className={styles.reviewTimelineCard}>
                          <div className={styles.revHeader}>
                            <img src={r.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100"} alt={r.author} className={styles.revAvatar} />
                            <div className={styles.revMetaInfo}>
                              <div className={styles.revNameRow}>
                                <strong>{r.author}</strong>
                              </div>
                              <span className={styles.revDate}>
                                {r.createdAt ? new Date(r.createdAt).toLocaleDateString("vi-VN") : "Chưa rõ ngày"} • ⭐️ {r.rating} sao
                              </span>
                            </div>
                          </div>
                          <p className={styles.revContent}>{r.content}</p>
                          <div className={styles.revFooter}>
                            <button className={styles.helpfulBtn} onClick={() => showToast(`Cảm ơn bạn đã bình chọn hữu ích cho ${r.author}!`)}>
                              👍 Hữu ích ({r.helpful || 0})
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}

        {/* Call to Action Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <span className={styles.ctaAccent}>Bạn vẫn chưa tìm được sự lựa chọn hoàn hảo?</span>
            <h2 className={styles.ctaTitle}>Lập kế hoạch tiệc cưới dễ dàng cùng cố vấn AN Wedding</h2>
            <p className={styles.ctaSubtitle}>
              Hãy chia sẻ ngân sách và mong muốn của hai bạn. Chuyên viên tư vấn tiệc cưới giàu kinh nghiệm của chúng tôi luôn sẵn sàng đồng hành hỗ trợ miễn phí.
            </p>
            <button
              className={styles.ctaBtn}
              onClick={() => handleBookConsultation("Cố vấn chuyên môn AN Wedding")}
            >
              Đặt lịch tư vấn miễn phí
            </button>
          </div>
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default ComparePage;
