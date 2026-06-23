import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import { API_URL } from "../config";
import styles from "./ComparePage.module.css";

// 5 Categories Configuration
const CATEGORIES = [
  { id: "nha_hang", name: "Nhà hàng tiệc cưới" },
  { id: "trang_diem", name: "Trang điểm cô dâu" },
  { id: "xe_hoa", name: "Xe hoa ngày cưới" },
  { id: "chup_anh", name: "Chụp ảnh, phóng sự" },
  { id: "vay_cuoi", name: "Thuê váy & vest cưới" }
];

// Helper to generate consistent mock details for criteria that are not stored in standard DB
const generateAttributes = (service) => {
  if (!service) return {};

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
  const ratingVal = service.rating || 5.0;

  const compAttr = service.comparisonAttributes || {};

  const common = {
    id: service._id,
    name: service.name,
    categoryName: service.category === "nha_hang" ? "Nhà hàng tiệc cưới" :
                  service.category === "trang_diem" ? "Trang điểm cô dâu" :
                  service.category === "xe_hoa" ? "Xe hoa ngày cưới" :
                  service.category === "chup_anh" ? "Chụp ảnh, phóng sự" : "Thuê váy & vest cưới",
    providerName: compAttr.providerName || (service.vendor?.name) || getSeededValue(seed + "vendor", ["An Wedding Premium", "Gia Đình Việt Planner", "Happy Day Studio", "Luxury Wedding Organizer", "ROYAL Wedding Decor"]),
    imageUrl: service.image || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
    location: service.location || "Quận 1",
    address: service.address || "Chưa cập nhật",
    basePrice: basePrice,
    minPrice: compAttr.minPrice ? Number(compAttr.minPrice) : (basePrice * 0.9),
    maxPrice: compAttr.maxPrice ? Number(compAttr.maxPrice) : (basePrice * 1.5),
    rating: ratingVal,
    reviewCount: service.reviewsCount || compAttr.reviewCount || getSeededValue(seed + "rev", [18, 45, 89, 124, 256, 412]),
    status: compAttr.status || getSeededValue(seed + "status", ["Đang nhận lịch", "Còn trống ít ngày", "Hết lịch tháng này"]),
    promotion: service.badge || compAttr.promotion || getSeededValue(seed + "promo", ["Giảm 10% gói cưới", "Tặng cổng hoa tươi", "Tặng album cưới mini", "Không có ưu đãi"]),
    depositPolicy: compAttr.depositPolicy || getSeededValue(seed + "deposit", ["Đặt cọc trước 30% để giữ ngày", "Đặt cọc trước 50%", "Đặt cọc trước 20%"]),
    cancellationPolicy: compAttr.cancellationPolicy || getSeededValue(seed + "cancel", ["Hủy trước 30 ngày hoàn cọc 100%", "Hủy trước 15 ngày hoàn cọc 50%", "Không hoàn cọc khi hủy"]),
    responseTime: compAttr.responseTime || getSeededValue(seed + "response", ["Dưới 15 phút", "Trong vòng 1 giờ", "Trong vòng 2 giờ", "Trong vòng 24 giờ"]),
    includedServices: service.includedServices && service.includedServices.length > 0 
      ? service.includedServices.join(", ") 
      : (compAttr.includedServices || getSeededValue(seed + "inc", [
          "Hỗ trợ tư vấn kịch bản cưới hỏi, Nhân sự hỗ trợ tiệc cưới, Âm thanh sân khấu cơ bản",
          "Trọn gói chuẩn bị, Dặm phấn nhẹ trước giờ đón khách, Làm tóc cơ bản",
          "Tài xế chuyên nghiệp lái xe, Xăng xe nội thành dưới 50km, Trang trí hoa lụa cao cấp",
          "Hỗ trợ chỉnh sửa toàn bộ ảnh, Tặng kèm album photobook, Ekip 2 nhiếp ảnh gia",
          "Hỗ trợ chỉnh sửa số đo váy cưới, Cho thuê 3 ngày, Kèm trang sức voan cưới cô dâu"
        ])),
    notes: service.description || compAttr.notes || "Dịch vụ cưới hỏi chất lượng cao, mang lại trải nghiệm tuyệt vời cho ngày hạnh phúc của bạn."
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
  
  // Selected services state
  const [service1Id, setService1Id] = useState("");
  const [service2Id, setService2Id] = useState("");
  
  // Favorite state (sync with localStorage)
  const [favorites, setFavorites] = useState([]);
  
  // Alert/Feedback state
  const [alertMsg, setAlertMsg] = useState("");
  const [notification, setNotification] = useState("");

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
    // Load favorites from local storage
    const stored = localStorage.getItem("wedding_favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  // Fetch services when category changes
  useEffect(() => {
    setLoading(true);
    setService1Id("");
    setService2Id("");
    setAlertMsg("");
    setNotification("");
    
    fetch(`${API_URL}/api/services?category=${currentCategory}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải danh sách dịch vụ");
        return res.json();
      })
      .then((data) => {
        setServices(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setServices([]);
        setLoading(false);
      });
  }, [currentCategory]);

  const handleCategoryChange = (catId) => {
    setCurrentCategory(catId);
  };

  const handleSelectService1 = (e) => {
    const val = e.target.value;
    setService1Id(val);
    setAlertMsg("");
    setNotification("");
    if (val && val === service2Id) {
      setAlertMsg("Vui lòng chọn 2 dịch vụ khác nhau để so sánh.");
    }
  };

  const handleSelectService2 = (e) => {
    const val = e.target.value;
    setService2Id(val);
    setAlertMsg("");
    setNotification("");
    if (val && val === service1Id) {
      setAlertMsg("Vui lòng chọn 2 dịch vụ khác nhau để so sánh.");
    }
  };

  // Toggle favorite helper
  const toggleFavorite = (serviceId) => {
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
    setNotification(msg);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  const handleBookConsultation = (serviceName) => {
    showToast(`Đã gởi yêu cầu tư vấn cho "${serviceName}"! Chúng tôi sẽ phản hồi sớm nhất.`);
  };

  const handleSelectServiceDirect = (service) => {
    if (!service) return;
    showToast(`Đang chuyển hướng đến trang đặt lịch dịch vụ "${service.name}"...`);
    setTimeout(() => {
      navigate("/booking", {
        state: {
          serviceId: service._id,
          serviceName: service.name,
          category: service.category,
          amount: service.price,
          selectedPackages: "Đặt trực tiếp từ So sánh"
        }
      });
    }, 1500);
  };

  // Find actual service objects
  const s1Raw = services.find((s) => s._id === service1Id);
  const s2Raw = services.find((s) => s._id === service2Id);

  // Generate enriched attributes
  const s1 = s1Raw ? generateAttributes(s1Raw) : null;
  const s2 = s2Raw ? generateAttributes(s2Raw) : null;

  // Logic values validation
  const hasEnoughServices = services.length >= 2;
  const hasSelectedBoth = s1 && s2 && service1Id !== service2Id;

  // Format Helpers
  const formatPrice = (price) => {
    if (!price) return "Chưa cập nhật";
    return price.toLocaleString("vi-VN") + "đ";
  };

  const formatRating = (rating) => {
    if (!rating) return "Chưa cập nhật";
    return `${rating}/5`;
  };

  // Parse response time to minutes for comparison
  const parseResponseTime = (timeStr) => {
    if (!timeStr) return 9999;
    if (timeStr.includes("15 phút")) return 15;
    if (timeStr.includes("1 giờ")) return 60;
    if (timeStr.includes("2 giờ")) return 120;
    return 1440; // 24 hours or longer
  };

  // Highlights calculator
  const getHighlight = (key) => {
    if (!s1 || !s2) return {};
    
    switch (key) {
      case "basePrice":
        if (s1.basePrice < s2.basePrice) return { s1: "Tiết kiệm hơn" };
        if (s2.basePrice < s1.basePrice) return { s2: "Tiết kiệm hơn" };
        break;
      case "rating":
        if (s1.rating > s2.rating) return { s1: "Đánh giá tốt hơn" };
        if (s2.rating > s1.rating) return { s2: "Đánh giá tốt hơn" };
        break;
      case "responseTime":
        const t1 = parseResponseTime(s1.responseTime);
        const t2 = parseResponseTime(s2.responseTime);
        if (t1 < t2) return { s1: "Phản hồi nhanh hơn" };
        if (t2 < t1) return { s2: "Phản hồi nhanh hơn" };
        break;
      case "deliveryTime": // specifically for chụp ảnh
        const d1 = s1.deliveryDaysNum || 999;
        const d2 = s2.deliveryDaysNum || 999;
        if (d1 < d2) return { s1: "Nhanh hơn" };
        if (d2 < d1) return { s2: "Nhanh hơn" };
        break;
      case "amenities":
        const len1 = s1Raw?.amenities?.length || 0;
        const len2 = s2Raw?.amenities?.length || 0;
        if (len1 > len2) return { s1: "Nhiều tiện ích hơn" };
        if (len2 > len1) return { s2: "Nhiều tiện ích hơn" };
        break;
      default:
        return {};
    }
    return {};
  };

  // Render Table Criteria rows
  const renderRow = (label, key, isPrice = false, isRating = false, isHighlightable = false) => {
    if (!s1 || !s2) return null;
    const val1 = s1[key] || "Chưa cập nhật";
    const val2 = s2[key] || "Chưa cập nhật";
    
    let display1 = isPrice ? formatPrice(val1) : isRating ? formatRating(val1) : val1;
    let display2 = isPrice ? formatPrice(val2) : isRating ? formatRating(val2) : val2;

    const hl = isHighlightable ? getHighlight(key) : {};

    return (
      <tr key={key} className={hl.s1 || hl.s2 ? styles.highlightRow : ""}>
        <td className={styles.colCriteria}>{label}</td>
        <td className={styles.colService}>
          {display1}
          {hl.s1 && <span className={[styles.badgeHighlight, styles.badgeBetter].join(" ")}>{hl.s1}</span>}
        </td>
        <td className={styles.colService}>
          {display2}
          {hl.s2 && <span className={[styles.badgeHighlight, styles.badgeBetter].join(" ")}>{hl.s2}</span>}
        </td>
      </tr>
    );
  };

  // Dynamic Suggestion generation based on comparative attributes
  const getSuggestions = () => {
    if (!s1 || !s2) return [];
    
    const suggestions = [];

    // Price suggestion
    if (s1.basePrice < s2.basePrice) {
      suggestions.push({
        target: s1.name,
        text: `Phù hợp nếu bạn muốn tối ưu chi phí (tiết kiệm ${(s2.basePrice - s1.basePrice).toLocaleString("vi-VN")}đ).`
      });
    } else if (s2.basePrice < s1.basePrice) {
      suggestions.push({
        target: s2.name,
        text: `Phù hợp nếu bạn muốn tối ưu chi phí (tiết kiệm ${(s1.basePrice - s2.basePrice).toLocaleString("vi-VN")}đ).`
      });
    }

    // Rating suggestion
    if (s1.rating > s2.rating) {
      suggestions.push({
        target: s1.name,
        text: `Phù hợp nếu bạn ưu tiên chất lượng đánh giá từ người dùng (${s1.rating}/5 so với ${s2.rating}/5).`
      });
    } else if (s2.rating > s1.rating) {
      suggestions.push({
        target: s2.name,
        text: `Phù hợp nếu bạn ưu tiên chất lượng đánh giá từ người dùng (${s2.rating}/5 so với ${s1.rating}/5).`
      });
    }

    // Category specific recommendations
    if (currentCategory === "nha_hang") {
      const cap1 = parseInt(s1.capacity) || 0;
      const cap2 = parseInt(s2.capacity) || 0;
      if (cap1 > cap2) {
        suggestions.push({
          target: s1.name,
          text: `Phù hợp với tiệc cưới có số lượng khách lớn (Sức chứa lên đến ${s1.capacity}).`
        });
      } else if (cap2 > cap1) {
        suggestions.push({
          target: s2.name,
          text: `Phù hợp với tiệc cưới có số lượng khách lớn (Sức chứa lên đến ${s2.capacity}).`
        });
      }
    } else if (currentCategory === "trang_diem") {
      if (s1.homeService && s1.homeService.includes("miễn phí")) {
        suggestions.push({
          target: s1.name,
          text: `Phù hợp nếu bạn muốn tiết kiệm thời gian di chuyển trong ngày cưới (Hỗ trợ làm tại nhà miễn phí).`
        });
      }
      if (s2.homeService && s2.homeService.includes("miễn phí")) {
        suggestions.push({
          target: s2.name,
          text: `Phù hợp nếu bạn muốn tiết kiệm thời gian di chuyển trong ngày cưới (Hỗ trợ làm tại nhà miễn phí).`
        });
      }
    } else if (currentCategory === "xe_hoa") {
      if (s1.rentalDuration && s1.rentalDuration.includes("Trọn gói")) {
        suggestions.push({
          target: s1.name,
          text: `Phù hợp nếu lịch trình rước dâu và tiệc cưới kéo dài trong ngày (Thuê trọn gói ngày cưới).`
        });
      } else if (s2.rentalDuration && s2.rentalDuration.includes("Trọn gói")) {
        suggestions.push({
          target: s2.name,
          text: `Phù hợp nếu lịch trình rước dâu và tiệc cưới kéo dài trong ngày (Thuê trọn gói ngày cưới).`
        });
      }
    } else if (currentCategory === "chup_anh") {
      const photos1 = parseInt(s1.editedPhotos) || 0;
      const photos2 = parseInt(s2.editedPhotos) || 0;
      if (photos1 > photos2) {
        suggestions.push({
          target: s1.name,
          text: `Phù hợp nếu bạn muốn có nhiều ảnh hoàn thiện chất lượng cao hơn (${s1.editedPhotos}).`
        });
      } else if (photos2 > photos1) {
        suggestions.push({
          target: s2.name,
          text: `Phù hợp nếu bạn muốn có nhiều ảnh hoàn thiện chất lượng cao hơn (${s2.editedPhotos}).`
        });
      }
    } else if (currentCategory === "vay_cuoi") {
      if (s1.sizeAdjustment && s1.sizeAdjustment.includes("theo số đo")) {
        suggestions.push({
          target: s1.name,
          text: `Phù hợp nếu bạn muốn trang phục cưới vừa vặn tuyệt đối (Có thợ chỉnh sửa chi tiết theo số đo).`
        });
      }
      if (s2.sizeAdjustment && s2.sizeAdjustment.includes("theo số đo")) {
        suggestions.push({
          target: s2.name,
          text: `Phù hợp nếu bạn muốn trang phục cưới vừa vặn tuyệt đối (Có thợ chỉnh sửa chi tiết theo số đo).`
        });
      }
    }

    return suggestions;
  };

  return (
    <div className={styles.comparePage}>
      {/* Shared Header Component */}
      <SharedHeader theme="light" />

      {/* Floating Notification/Toast */}
      {notification && (
        <div style={{
          position: "fixed",
          top: "100px",
          right: "24px",
          backgroundColor: "#4d5637",
          color: "#ffffff",
          padding: "12px 24px",
          borderRadius: "4px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          zIndex: 9999,
          fontSize: "14px",
          fontWeight: "600",
          animation: "fadeIn 0.3s ease"
        }}>
          ✨ {notification}
        </div>
      )}

      <main className={styles.container}>
        {/* Title Section */}
        <section className={styles.hero}>
          <span className={styles.subTitle}>— DÀNH CHO NGÀY CƯỚI TRỌN VẸN —</span>
          <h1 className={styles.mainTitle}>So Sánh Dịch Vụ Cưới</h1>
          <p className={styles.description}>
            Chọn 2 dịch vụ cùng danh mục để so sánh giá thành, tiện ích và các tiêu chí quan trọng trước khi đưa ra lựa chọn phù hợp cho ngày cưới của bạn.
          </p>
          <p className={styles.alertDesc}>
            * Bạn chỉ có thể so sánh các dịch vụ thuộc cùng một danh mục.
          </p>
        </section>

        {/* Category Selector Tabs */}
        <section className={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={[styles.tabBtn, currentCategory === cat.id ? styles.tabBtnActive : ""].join(" ")}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </section>

        {/* Warn if not enough services in category */}
        {!loading && !hasEnoughServices && (
          <div className={styles.alertBanner}>
            ⚠️ Danh mục này hiện chưa có đủ dịch vụ để tiến hành so sánh. Vui lòng thêm dịch vụ mới hoặc chọn danh mục khác!
          </div>
        )}

        {/* Warn if same service selected */}
        {alertMsg && (
          <div className={styles.alertBanner}>
            ⚠️ {alertMsg}
          </div>
        )}

        {/* Selectors and Previews Area */}
        {hasEnoughServices && (
          <section className={styles.selectorsArea}>
            {/* Service 1 Selection Card */}
            <div className={styles.selectorCard}>
              <h3 className={styles.selectorLabel}>Dịch vụ thứ nhất</h3>
              <select
                className={styles.selectDropdown}
                value={service1Id}
                onChange={handleSelectService1}
              >
                <option value="">-- Chọn dịch vụ thứ nhất --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.location})</option>
                ))}
              </select>

              {s1 && (
                <div className={styles.previewContainer}>
                  <div className={styles.previewImageWrapper}>
                    <img src={s1.imageUrl} alt={s1.name} className={styles.previewImage} />
                    {s1Raw?.badge && <span className={styles.badge}>{s1Raw.badge}</span>}
                  </div>
                  <div className={styles.previewBody}>
                    <p className={styles.previewProvider}>{s1.providerName}</p>
                    <h4 className={styles.previewTitle}>{s1.name}</h4>
                    <div className={styles.previewMeta}>
                      <div className={styles.previewMetaRow}>
                        <span>📍</span> {s1.location}
                      </div>
                      <div className={styles.previewMetaRow}>
                        <span className={styles.previewRating}>
                          <span className={styles.starIcon}>★</span> {s1.rating}
                          <span className={styles.reviewsCountText}>({s1.reviewCount} đánh giá)</span>
                        </span>
                      </div>
                      <div className={styles.previewPrice}>
                        {s1Raw?.priceLabel || formatPrice(s1.basePrice)}
                      </div>
                    </div>
                    <Link to={`/service/${s1.id}`} className={styles.viewDetailBtn}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Service 2 Selection Card */}
            <div className={styles.selectorCard}>
              <h3 className={styles.selectorLabel}>Dịch vụ thứ hai</h3>
              <select
                className={styles.selectDropdown}
                value={service2Id}
                onChange={handleSelectService2}
              >
                <option value="">-- Chọn dịch vụ thứ hai --</option>
                {services.map((s) => (
                  <option key={s._id} value={s._id}>{s.name} ({s.location})</option>
                ))}
              </select>

              {s2 && (
                <div className={styles.previewContainer}>
                  <div className={styles.previewImageWrapper}>
                    <img src={s2.imageUrl} alt={s2.name} className={styles.previewImage} />
                    {s2Raw?.badge && <span className={styles.badge}>{s2Raw.badge}</span>}
                  </div>
                  <div className={styles.previewBody}>
                    <p className={styles.previewProvider}>{s2.providerName}</p>
                    <h4 className={styles.previewTitle}>{s2.name}</h4>
                    <div className={styles.previewMeta}>
                      <div className={styles.previewMetaRow}>
                        <span>📍</span> {s2.location}
                      </div>
                      <div className={styles.previewMetaRow}>
                        <span className={styles.previewRating}>
                          <span className={styles.starIcon}>★</span> {s2.rating}
                          <span className={styles.reviewsCountText}>({s2.reviewCount} đánh giá)</span>
                        </span>
                      </div>
                      <div className={styles.previewPrice}>
                        {s2Raw?.priceLabel || formatPrice(s2.basePrice)}
                      </div>
                    </div>
                    <Link to={`/service/${s2.id}`} className={styles.viewDetailBtn}>
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty States */}
        {!hasSelectedBoth && !loading && (
          <section className={styles.emptyState}>
            <div className={styles.emptyIcon}>⚖️</div>
            <h3 className={styles.emptyTitle}>Chưa đủ dữ liệu so sánh</h3>
            <p className={styles.emptyText}>
              {service1Id || service2Id
                ? "Vui lòng chọn tiếp dịch vụ còn lại thuộc cùng danh mục để mở bảng so sánh chi tiết."
                : "Vui lòng chọn danh mục dịch vụ ở thanh menu trên, sau đó chọn 2 dịch vụ cưới để xem bảng đánh giá chi tiết."}
            </p>
          </section>
        )}

        {loading && (
          <section className={styles.emptyState}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "3px solid rgba(195, 147, 124, 0.3)",
              borderTopColor: "#c3937c",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            <p style={{ marginTop: "12px", color: "#787878" }}>Đang tải dữ liệu dịch vụ từ sàn cưới...</p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </section>
        )}

        {/* Comparison Table Section (Desktop only) */}
        {hasSelectedBoth && !loading && (
          <>
            <section className={styles.tableSection}>
              <div className={styles.tableWrapper}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th className={styles.colCriteria}>Tiêu chí so sánh</th>
                      <th className={styles.colService}>{s1.name}</th>
                      <th className={styles.colService}>{s2.name}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Common Criteria */}
                    <tr>
                      <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                        📌 THÔNG TIN CHUNG
                      </td>
                    </tr>
                    {renderRow("Tên dịch vụ", "name")}
                    {renderRow("Nhà cung cấp", "providerName")}
                    {renderRow("Danh mục", "categoryName")}
                    {renderRow("Khu vực / Địa điểm", "location")}
                    {renderRow("Giá khởi điểm", "basePrice", true, false, true)}
                    {renderRow("Giá tối thiểu ước tính", "minPrice", true)}
                    {renderRow("Giá tối đa ước tính", "maxPrice", true)}
                    {renderRow("Đánh giá trung bình", "rating", false, true, true)}
                    {renderRow("Số lượt đánh giá", "reviewCount")}
                    {renderRow("Trạng thái nhận lịch", "status")}
                    {renderRow("Ưu đãi hiện có", "promotion")}
                    {renderRow("Chính sách đặt cọc", "depositPolicy")}
                    {renderRow("Chính sách hủy lịch", "cancellationPolicy")}
                    {renderRow("Thời gian phản hồi", "responseTime", false, false, true)}
                    {renderRow("Tiện ích đi kèm", "includedServices")}
                    {renderRow("Ghi chú đặc biệt", "notes")}

                    {/* Category-Specific Criteria */}
                    {currentCategory === "nha_hang" && (
                      <>
                        <tr>
                          <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                            🏢 TIÊU CHÍ RIÊNG: NHÀ HÀNG TIỆC CƯỚI
                          </td>
                        </tr>
                        {renderRow("Sức chứa tối đa", "capacity")}
                        {renderRow("Số bàn tối thiểu", "minTables")}
                        {renderRow("Khoảng giá mỗi bàn", "pricePerTable")}
                        {renderRow("Thực đơn mẫu", "sampleMenu")}
                        {renderRow("Loại sảnh tiệc", "hallType")}
                        {renderRow("Sân khấu & Bục phát biểu", "stage")}
                        {renderRow("Hệ thống âm thanh ánh sáng", "soundLighting")}
                        {renderRow("Bãi đỗ xe", "parking")}
                        {renderRow("Phí dịch vụ & VAT", "serviceFee")}
                        {renderRow("Thời gian tổ chức tiệc", "eventDuration")}
                        {renderRow("Dịch vụ trang trí hoa cưới", "decorationIncluded")}
                      </>
                    )}

                    {currentCategory === "trang_diem" && (
                      <>
                        <tr>
                          <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                            💄 TIÊU CHÍ RIÊNG: TRANG ĐIỂM CÔ DÂU
                          </td>
                        </tr>
                        {renderRow("Loại gói trang điểm", "packageType")}
                        {renderRow("Phong cách trang điểm", "makeupStyle")}
                        {renderRow("Trang điểm thử trước lễ", "trialMakeup")}
                        {renderRow("Làm tóc đi kèm", "hairStylingIncluded")}
                        {renderRow("Thời gian thực hiện (phút)", "duration")}
                        {renderRow("Có dặm phấn tại nhà", "homeService")}
                        {renderRow("Số người hỗ trợ tiệc", "assistantCount")}
                        {renderRow("Thương hiệu mỹ phẩm", "cosmeticsBrand")}
                        {renderRow("Phụ phí di chuyển xa", "travelFee")}
                        {renderRow("Thời gian đặt lịch trước", "bookingAdvanceTime")}
                      </>
                    )}

                    {currentCategory === "xe_hoa" && (
                      <>
                        <tr>
                          <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                            🚗 TIÊU CHÍ RIÊNG: XE HOA NGÀY CƯỚI
                          </td>
                        </tr>
                        {renderRow("Loại xe hoa", "carType")}
                        {renderRow("Dòng xe chi tiết", "carModel")}
                        {renderRow("Màu sắc xe", "carColor")}
                        {renderRow("Thời gian thuê quy định", "rentalDuration")}
                        {renderRow("Giới hạn số km đi chuyển", "kmLimit")}
                        {renderRow("Có tài xế đi kèm", "driverIncluded")}
                        {renderRow("Trang trí xe cưới sẵn", "flowerDecoration")}
                        {renderRow("Phí vượt giờ phụ thu", "overtimeFee")}
                        {renderRow("Phí vượt số km phụ thu", "extraKmFee")}
                        {renderRow("Khu vực phục vụ cho thuê", "serviceArea")}
                        {renderRow("Điều kiện đặt cọc xe", "depositCondition")}
                      </>
                    )}

                    {currentCategory === "chup_anh" && (
                      <>
                        <tr>
                          <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                            📸 TIÊU CHÍ RIÊNG: CHỤP ẢNH & PHÓNG SỰ
                          </td>
                        </tr>
                        {renderRow("Loại gói chụp ảnh", "packageType")}
                        {renderRow("Phong cách nhiếp ảnh", "photographyStyle")}
                        {renderRow("Thời lượng buổi chụp", "shootingDuration")}
                        {renderRow("Số lượng nhiếp ảnh gia", "photographerCount")}
                        {renderRow("Số lượng ảnh chỉnh sửa", "editedPhotos")}
                        {renderRow("Trả file ảnh gốc", "rawPhotos")}
                        {renderRow("Quay video phóng sự", "videoIncluded")}
                        {renderRow("Video Highlight đi kèm", "highlightVideo")}
                        {renderRow("Album cưới đính kèm", "albumIncluded")}
                        {renderRow("Địa điểm thực hiện chụp", "shootingLocation")}
                        {renderRow("Thời gian bàn giao sản phẩm", "deliveryTime", false, false, true)}
                        {renderRow("Phí di chuyển phát sinh", "travelFee")}
                      </>
                    )}

                    {currentCategory === "vay_cuoi" && (
                      <>
                        <tr>
                          <td colSpan={3} style={{ background: "rgba(195, 147, 124, 0.08)", fontWeight: "bold", fontFamily: "Cormorant, serif", fontSize: "16px" }}>
                            👗 TIÊU CHÍ RIÊNG: THUÊ VÁY & VEST CƯỚI
                          </td>
                        </tr>
                        {renderRow("Loại trang phục cưới", "outfitType")}
                        {renderRow("Số lượng đồ trong gói", "outfitQuantity")}
                        {renderRow("Thời hạn thuê giữ váy", "rentalDuration")}
                        {renderRow("Có thử đồ thoải mái", "fittingAvailable")}
                        {renderRow("Hỗ trợ chỉnh sửa số đo", "sizeAdjustment")}
                        {renderRow("Phí giặt là hấp sấy", "cleaningFee")}
                        {renderRow("Tiền cọc thế chấp", "depositAmount")}
                        {renderRow("Chính sách đền bù hư hại", "damagePolicy")}
                        {renderRow("Size trang phục sẵn có", "availableSizes")}
                        {renderRow("Phụ kiện đi kèm váy/vest", "accessoriesIncluded")}
                        {renderRow("Phí thuê quá hạn mỗi ngày", "extraDayFee")}
                      </>
                    )}

                    {/* Actions button row inside the table footer */}
                    <tr>
                      <td className={styles.criteriaCell}>Thao tác hành động</td>
                      <td>
                        <div className={styles.actionRow}>
                          <button
                            className={[styles.actionBtn, styles.btnOutline, favorites.includes(s1.id) ? styles.btnOutlineActive : ""].join(" ")}
                            onClick={() => toggleFavorite(s1.id)}
                          >
                            {favorites.includes(s1.id) ? "❤️ Đã thích" : "🤍 Yêu thích"}
                          </button>
                          <button
                            className={[styles.actionBtn, styles.btnSecondary].join(" ")}
                            onClick={() => handleBookConsultation(s1.name)}
                          >
                            Tư vấn
                          </button>
                          <button
                            className={[styles.actionBtn, styles.btnPrimary].join(" ")}
                            onClick={() => handleSelectServiceDirect(s1Raw)}
                          >
                            Chọn
                          </button>
                        </div>
                      </td>
                      <td>
                        <div className={styles.actionRow}>
                          <button
                            className={[styles.actionBtn, styles.btnOutline, favorites.includes(s2.id) ? styles.btnOutlineActive : ""].join(" ")}
                            onClick={() => toggleFavorite(s2.id)}
                          >
                            {favorites.includes(s2.id) ? "❤️ Đã thích" : "🤍 Yêu thích"}
                          </button>
                          <button
                            className={[styles.actionBtn, styles.btnSecondary].join(" ")}
                            onClick={() => handleBookConsultation(s2.name)}
                          >
                            Tư vấn
                          </button>
                          <button
                            className={[styles.actionBtn, styles.btnPrimary].join(" ")}
                            onClick={() => handleSelectServiceDirect(s2Raw)}
                          >
                            Chọn
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mobile Cards-Based Comparison Layout */}
            <section className={styles.mobileCompareList}>
              {/* Common Details Card */}
              <div className={styles.mobileCriteriaCard}>
                <div className={styles.mobileCriteriaHeader}>📌 THÔNG TIN CHUNG</div>
                <div className={styles.mobileCriteriaBody}>
                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Giá khởi điểm</span>
                    <div className={styles.mobileValueText}>
                      <strong>{s1.name}</strong>: {formatPrice(s1.basePrice)}
                      {getHighlight("basePrice").s1 && <span className={styles.badgeHighlight}>{getHighlight("basePrice").s1}</span>}
                    </div>
                    <div style={{ marginTop: "4px" }} className={styles.mobileValueText}>
                      <strong>{s2.name}</strong>: {formatPrice(s2.basePrice)}
                      {getHighlight("basePrice").s2 && <span className={styles.badgeHighlight}>{getHighlight("basePrice").s2}</span>}
                    </div>
                  </div>

                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Đánh giá & Rating</span>
                    <div className={styles.mobileValueText}>
                      <strong>{s1.name}</strong>: {formatRating(s1.rating)} ({s1.reviewCount} đánh giá)
                      {getHighlight("rating").s1 && <span className={styles.badgeHighlight}>{getHighlight("rating").s1}</span>}
                    </div>
                    <div style={{ marginTop: "4px" }} className={styles.mobileValueText}>
                      <strong>{s2.name}</strong>: {formatRating(s2.rating)} ({s2.reviewCount} đánh giá)
                      {getHighlight("rating").s2 && <span className={styles.badgeHighlight}>{getHighlight("rating").s2}</span>}
                    </div>
                  </div>

                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Khu vực / Địa điểm</span>
                    <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.location}</div>
                    <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.location}</div>
                  </div>

                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Thời gian phản hồi</span>
                    <div className={styles.mobileValueText}>
                      <strong>{s1.name}</strong>: {s1.responseTime}
                      {getHighlight("responseTime").s1 && <span className={styles.badgeHighlight}>{getHighlight("responseTime").s1}</span>}
                    </div>
                    <div className={styles.mobileValueText}>
                      <strong>{s2.name}</strong>: {s2.responseTime}
                      {getHighlight("responseTime").s2 && <span className={styles.badgeHighlight}>{getHighlight("responseTime").s2}</span>}
                    </div>
                  </div>

                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Ưu đãi</span>
                    <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.promotion}</div>
                    <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.promotion}</div>
                  </div>

                  <div className={styles.mobileServiceValue}>
                    <span className={styles.mobileServiceLabel}>Tiện ích bao gồm</span>
                    <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.includedServices}</div>
                    <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.includedServices}</div>
                  </div>
                </div>
              </div>

              {/* Category-Specific Card for Mobile */}
              <div className={styles.mobileCriteriaCard}>
                <div className={styles.mobileCriteriaHeader}>💼 CHI TIẾT DỊCH VỤ</div>
                <div className={styles.mobileCriteriaBody}>
                  {currentCategory === "nha_hang" && (
                    <>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Sức chứa tối đa</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.capacity}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.capacity}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Giá mỗi bàn</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.pricePerTable}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.pricePerTable}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Thực đơn mẫu</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.sampleMenu}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.sampleMenu}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Bãi đỗ xe</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.parking}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.parking}</div>
                      </div>
                    </>
                  )}

                  {currentCategory === "trang_diem" && (
                    <>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Phong cách trang điểm</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.makeupStyle}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.makeupStyle}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Trang điểm thử</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.trialMakeup}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.trialMakeup}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Hỗ trợ tại nhà</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.homeService}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.homeService}</div>
                      </div>
                    </>
                  )}

                  {currentCategory === "xe_hoa" && (
                    <>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Dòng xe & Màu sắc</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.carModel} ({s1.carColor})</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.carModel} ({s2.carColor})</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Thời gian thuê</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.rentalDuration}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.rentalDuration}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Tài xế kèm theo</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.driverIncluded}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.driverIncluded}</div>
                      </div>
                    </>
                  )}

                  {currentCategory === "chup_anh" && (
                    <>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Số ảnh chỉnh sửa</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.editedPhotos}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.editedPhotos}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Thời gian trả sản phẩm</span>
                        <div className={styles.mobileValueText}>
                          <strong>{s1.name}</strong>: {s1.deliveryTime}
                          {getHighlight("deliveryTime").s1 && <span className={styles.badgeHighlight}>{getHighlight("deliveryTime").s1}</span>}
                        </div>
                        <div className={styles.mobileValueText}>
                          <strong>{s2.name}</strong>: {s2.deliveryTime}
                          {getHighlight("deliveryTime").s2 && <span className={styles.badgeHighlight}>{getHighlight("deliveryTime").s2}</span>}
                        </div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Quay Video</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.videoIncluded}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.videoIncluded}</div>
                      </div>
                    </>
                  )}

                  {currentCategory === "vay_cuoi" && (
                    <>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Số lượng trang phục</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.outfitQuantity}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.outfitQuantity}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Sửa size trang phục</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.sizeAdjustment}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.sizeAdjustment}</div>
                      </div>
                      <div className={styles.mobileServiceValue}>
                        <span className={styles.mobileServiceLabel}>Thời gian thuê giữ váy</span>
                        <div className={styles.mobileValueText}><strong>{s1.name}</strong>: {s1.rentalDuration}</div>
                        <div className={styles.mobileValueText}><strong>{s2.name}</strong>: {s2.rentalDuration}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Actions Card */}
              <div className={styles.mobileCriteriaCard}>
                <div className={styles.mobileCriteriaHeader}>⚡ THAO TÁC</div>
                <div className={styles.mobileCriteriaBody}>
                  <div className={styles.mobileServiceValue}>
                    <div style={{ fontWeight: "600", fontSize: "13px" }}>{s1.name}:</div>
                    <div className={styles.actionRow}>
                      <button
                        className={[styles.actionBtn, styles.btnOutline, favorites.includes(s1.id) ? styles.btnOutlineActive : ""].join(" ")}
                        onClick={() => toggleFavorite(s1.id)}
                      >
                        {favorites.includes(s1.id) ? "❤️ Thích" : "🤍 Yêu thích"}
                      </button>
                      <button
                        className={[styles.actionBtn, styles.btnSecondary].join(" ")}
                        onClick={() => handleBookConsultation(s1.name)}
                      >
                        Tư vấn
                      </button>
                      <button
                        className={[styles.actionBtn, styles.btnPrimary].join(" ")}
                        onClick={() => handleSelectServiceDirect(s1Raw)}
                      >
                        Chọn
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: "8px" }} className={styles.mobileServiceValue}>
                    <div style={{ fontWeight: "600", fontSize: "13px" }}>{s2.name}:</div>
                    <div className={styles.actionRow}>
                      <button
                        className={[styles.actionBtn, styles.btnOutline, favorites.includes(s2.id) ? styles.btnOutlineActive : ""].join(" ")}
                        onClick={() => toggleFavorite(s2.id)}
                      >
                        {favorites.includes(s2.id) ? "❤️ Thích" : "🤍 Yêu thích"}
                      </button>
                      <button
                        className={[styles.actionBtn, styles.btnSecondary].join(" ")}
                        onClick={() => handleBookConsultation(s2.name)}
                      >
                        Tư vấn
                      </button>
                      <button
                        className={[styles.actionBtn, styles.btnPrimary].join(" ")}
                        onClick={() => handleSelectServiceDirect(s2Raw)}
                      >
                        Chọn
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Recommendations / Lời Khuyên Box */}
            <section className={styles.recommendationBox}>
              <h3 className={styles.recTitle}>💡 Gợi ý lựa chọn từ AN Wedding</h3>
              <ul className={styles.recList}>
                {getSuggestions().length > 0 ? (
                  getSuggestions().map((sug, idx) => (
                    <li key={idx} className={styles.recItem}>
                      <strong>{sug.target}</strong>: {sug.text}
                    </li>
                  ))
                ) : (
                  <li className={styles.recItem}>
                    Cả hai gói dịch vụ có sự đồng đều khá cao về giá thành và đánh giá. Vui lòng dựa vào địa điểm cụ thể và hình ảnh thực tế để đưa ra quyết định phù hợp nhất.
                  </li>
                )}
              </ul>
            </section>
          </>
        )}
      </main>

      {/* Shared Footer Component */}
      <Footer1 />
    </div>
  );
};

export default ComparePage;
