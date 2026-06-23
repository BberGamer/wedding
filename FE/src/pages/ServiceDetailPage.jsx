import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./ServiceDetailPage.module.css";
import { API_URL } from "../config";

const getEnrichedAttributes = (svc) => {
  if (!svc) return {};
  const name = svc.name || "";
  const id = svc._id || "";
  const seed = name + id;

  const getSeededValue = (str, array) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % array.length;
    return array[index];
  };

  const compAttr = svc.comparisonAttributes || {};
  const basePrice = svc.price || 0;

  const common = {
    providerName: compAttr.providerName || (svc.vendor?.name) || getSeededValue(seed + "vendor", ["An Wedding Premium", "Gia Đình Việt Planner", "Happy Day Studio", "Luxury Wedding Organizer", "ROYAL Wedding Decor"]),
    status: compAttr.status || getSeededValue(seed + "status", ["Đang nhận lịch", "Còn trống ít ngày", "Hết lịch tháng này"]),
    promotion: svc.badge || compAttr.promotion || getSeededValue(seed + "promo", ["Giảm 10% gói cưới", "Tặng cổng hoa tươi", "Tặng album cưới mini", "Không có ưu đãi"]),
    depositPolicy: compAttr.depositPolicy || getSeededValue(seed + "deposit", ["Đặt cọc trước 30% để giữ ngày", "Đặt cọc trước 50%", "Đặt cọc trước 20%"]),
    cancellationPolicy: compAttr.cancellationPolicy || getSeededValue(seed + "cancel", ["Hủy trước 30 ngày hoàn cọc 100%", "Hủy trước 15 ngày hoàn cọc 50%", "Không hoàn cọc khi hủy"]),
    responseTime: compAttr.responseTime || getSeededValue(seed + "response", ["Dưới 15 phút", "Trong vòng 1 giờ", "Trong vòng 2 giờ", "Trong vòng 24 giờ"]),
    minPrice: compAttr.minPrice ? Number(compAttr.minPrice) : (basePrice * 0.9),
    maxPrice: compAttr.maxPrice ? Number(compAttr.maxPrice) : (basePrice * 1.5),
  };

  let specific = {};
  if (svc.category === "nha_hang") {
    specific = {
      capacity: svc.capacity ? `${svc.capacity} khách` : (compAttr.capacity ? (compAttr.capacity.includes("khách") ? compAttr.capacity : `${compAttr.capacity} khách`) : getSeededValue(seed + "cap", ["300 khách", "450 khách", "600 khách", "800 khách"])),
      minTables: compAttr.minTables || getSeededValue(seed + "mintab", ["15 bàn", "20 bàn", "25 bàn", "30 bàn"]),
      pricePerTable: svc.priceLabel || compAttr.pricePerTable || `${(basePrice / 10).toLocaleString('vi-VN')}đ/bàn`,
      sampleMenu: compAttr.sampleMenu || getSeededValue(seed + "menu", ["Thực đơn Á-Âu 6 món", "Thực đơn thuần Việt 7 món", "Thực đơn Seafood cao cấp 6 món"]),
      hallType: compAttr.hallType || getSeededValue(seed + "hall", ["Trong nhà & Ngoài trời", "Sảnh tiệc máy lạnh", "Sân vườn ngoài trời"]),
      stage: compAttr.stage || getSeededValue(seed + "stage", ["Có sẵn, cao 0.8m, rộng 20m2", "Có sẵn, thiết kế di động", "Thiết kế theo yêu cầu"]),
      soundLighting: compAttr.soundLighting || getSeededValue(seed + "sound", ["Đèn LED màu, loa JBL chuyên nghiệp", "Hệ thống âm thanh sân khấu tiêu chuẩn", "Hệ thống cao cấp chuẩn phòng trà"]),
      parking: compAttr.parking || getSeededValue(seed + "park", ["Bãi đỗ xe ô tô & xe máy rộng rãi miễn phí", "Có chỗ đậu ô tô, có thu phí", "Bãi xe máy rộng, ô tô gửi lân cận"]),
      serviceFee: compAttr.serviceFee || getSeededValue(seed + "fee", ["Đã bao gồm trong giá bàn", "5% phí dịch vụ", "10% phí phục vụ và VAT"]),
      eventDuration: compAttr.eventDuration || getSeededValue(seed + "dur", ["4 tiếng", "5 tiếng", "Trọn gói ngày cưới"]),
      decorationIncluded: compAttr.decorationIncluded || getSeededValue(seed + "decor", ["Cổng hoa tươi, backdrop sân khấu", "Hoa tươi bàn tiệc và lối đi", "Trang trí bong bóng & hoa lụa cao cấp"])
    };
  } else if (svc.category === "trang_diem") {
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
  } else if (svc.category === "xe_hoa") {
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
  } else if (svc.category === "chup_anh") {
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
    };
  } else if (svc.category === "vay_cuoi") {
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

  return { ...common, ...specific };
};

const categoryLabels = {
  nha_hang: "Nhà hàng tiệc cưới",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa ngày cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế"
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activePhoto, setActivePhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const token = localStorage.getItem("token") || "";
  const user = (() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  const fetchReviews = () => {
    fetch(`${API_URL}/api/reviews?serviceId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải đánh giá");
        return res.json();
      })
      .then((data) => {
        setReviewsList(data);
      })
      .catch((err) => console.error("Lỗi khi tải đánh giá: ", err));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newContent.trim()) {
      setFormError("Vui lòng nhập nội dung nhận xét.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent,
          author: user?.name || user?.email || "Khách hàng",
          rating: newRating,
          serviceId: id,
          isHighlight: false
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Cảm ơn bạn đã gửi đánh giá thành công!");
        setNewContent("");
        setNewRating(5);
        fetchReviews();

        setService(prev => {
          if (!prev) return prev;
          const newCount = (prev.reviewsCount || 0) + 1;
          const newAvgRating = parseFloat(
            (((prev.rating || 5) * (prev.reviewsCount || 0) + newRating) / newCount).toFixed(1)
          );
          return {
            ...prev,
            reviewsCount: newCount,
            rating: newAvgRating
          };
        });
      } else {
        setFormError(data.message || "Gửi đánh giá thất bại.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải thông tin dịch vụ");
        return res.json();
      })
      .then((data) => {
        setService(data);
        setActivePhoto(data.image || "");
        
        // Auto-select the first package by default
        if (data.pricingDetails && data.pricingDetails.length > 0) {
          setSelectedItems([data.pricingDetails[0]]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Không tìm thấy dịch vụ yêu cầu.");
        setLoading(false);
      });
  }, [id]);

  // Recalculate price whenever selected items change
  useEffect(() => {
    const sum = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(sum);
  }, [selectedItems]);

  const handleCheckboxChange = (pkg) => {
    const isAlreadySelected = selectedItems.some((item) => item._id === pkg._id);
    if (isAlreadySelected) {
      // Must keep at least one package selected
      if (selectedItems.length === 1) return;
      setSelectedItems(selectedItems.filter((item) => item._id !== pkg._id));
    } else {
      setSelectedItems([...selectedItems, pkg]);
    }
  };

  const handlePayment = async () => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán dịch vụ!");
      navigate("/login", { state: { from: `/service/${id}` } });
      return;
    }

    if (totalPrice <= 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ để thanh toán!");
      return;
    }

    // Redirect to Booking Wizard Page instead of calling API directly here
    navigate(`/booking`, {
      state: {
        serviceId: service._id,
        serviceName: service.name,
        category: service.category,
        amount: totalPrice,
        selectedPackages: selectedItems.map((item) => item.name).join(", "),
      },
    });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <SharedHeader />
        <div className={styles.spinnerSection}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin dịch vụ tiệc cưới...</p>
        </div>
        <Footer1 />
      </div>
    );
  }

  if (errorMsg || !service) {
    return (
      <div className={styles.errorWrapper}>
        <SharedHeader />
        <div className={styles.errorContainer}>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Có lỗi xảy ra
          </h2>
          <p>{errorMsg || "Không tìm thấy thông tin dịch vụ này."}</p>
          <Link to="/" className={styles.backHomeBtn}>Quay lại trang chủ</Link>
        </div>
        <Footer1 />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SharedHeader />

      <main className={styles.mainContent}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Trang chủ</Link>
          <span className={styles.arrow}>/</span>
          <Link to={`/category/${service.category}`}>
            {service.category === "nha_hang" && "Nhà hàng"}
            {service.category === "trang_diem" && "Trang điểm cô dâu"}
            {service.category === "xe_hoa" && "Xe hoa cưới"}
            {service.category === "chup_anh" && "Chụp ảnh cưới"}
            {service.category === "vay_cuoi" && "Váy cưới thiết kế"}
          </Link>
          <span className={styles.arrow}>/</span>
          <span className={styles.current}>{service.name}</span>
        </div>

        {/* Head Intro */}
        <section className={styles.headIntro}>
          <div className={styles.headTitleBlock}>
            {service.badge && <span className={styles.badge}>{service.badge}</span>}
            <h1 className={styles.title}>{service.name}</h1>
            <div className={styles.ratingRow}>
              <span className={styles.star}>★</span>
              <span className={styles.ratingVal}>{service.rating}</span>
              <span className={styles.reviewsCount}>({service.reviewsCount} đánh giá khách hàng)</span>
            </div>
          </div>
          <div className={styles.priceEstimate}>
            <span className={styles.priceLabel}>GIÁ THAM KHẢO</span>
            <span className={styles.priceValue}>{service.priceLabel || formatPrice(service.price)}</span>
          </div>
        </section>

        {/* Photo Gallery & Album */}
        <section className={styles.gallerySection}>
          <div className={styles.largePhotoWrapper}>
            <img src={activePhoto} alt={service.name} className={styles.largePhoto} />
          </div>
          {service.album && service.album.length > 0 && (
            <div className={styles.thumbnailRow}>
              {service.album.map((photo, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnailWrapper} ${activePhoto === photo ? styles.activeThumbnail : ""}`}
                  onClick={() => setActivePhoto(photo)}
                >
                  <img src={photo} alt={`${service.name} album ${index + 1}`} className={styles.thumbnail} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Main Grid Bố cục 2 cột */}
        <div className={styles.gridContainer}>
          {/* Cột trái: Thông tin chi tiết */}
          <div className={styles.leftColumn}>
            {/* Thẻ liên hệ nhanh */}
            <div className={styles.contactCard}>
              <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Địa chỉ</span>
                    <span className={styles.value}>{service.address}</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Điện thoại</span>
                    <a href={`tel:${service.phone}`} className={styles.linkValue}>{service.phone}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Website</span>
                    <a href={service.website} target="_blank" rel="noopener noreferrer" className={styles.linkValue}>
                      {service.website.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Facebook</span>
                    <a href={service.facebook} target="_blank" rel="noopener noreferrer" className={styles.linkValue}>
                      {service.name} Official Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Card — Nhà cung cấp */}
            {service.vendor && (() => {
              // Check if vendor is populated object or raw ObjectId string
              const vendorId = typeof service.vendor === "object"
                ? (service.vendor._id || service.vendor.id)
                : service.vendor;
              const isPopulated = typeof service.vendor === "object" && service.vendor.name;

              return (
                <div className={styles.vendorCard}>
                  <h3 className={styles.sectionTitle}>Nhà Cung Cấp Dịch Vụ</h3>
                  <div className={styles.vendorCardInner}>
                    {isPopulated ? (
                      <>
                        <div className={styles.vendorCardLeft}>
                          {service.vendor.avatar ? (
                            <img
                              src={service.vendor.avatar}
                              alt={service.vendor.name}
                              className={styles.vendorAvatar}
                            />
                          ) : (
                            <div className={styles.vendorAvatarFallback}>
                              {service.vendor.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={styles.vendorIdentity}>
                            <span className={styles.vendorRoleBadge}>NHÀ CUNG CẤP</span>
                            <strong className={styles.vendorName}>{service.vendor.name}</strong>
                            {service.vendor.email && (
                              <span className={styles.vendorEmail}>{service.vendor.email}</span>
                            )}
                          </div>
                        </div>

                        {service.vendor.description && (
                          <p className={styles.vendorDesc}>{service.vendor.description}</p>
                        )}

                        <div className={styles.vendorMeta}>
                          {service.vendor.phone && (
                            <a href={`tel:${service.vendor.phone}`} className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              {service.vendor.phone}
                            </a>
                          )}
                          {service.vendor.address && (
                            <span className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                              </svg>
                              {service.vendor.address}
                            </span>
                          )}
                          {service.vendor.facebook && (
                            <a href={service.vendor.facebook} target="_blank" rel="noreferrer" className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                              </svg>
                              Facebook
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: "#787878", margin: 0 }}>
                        Thông tin nhà cung cấp sẽ hiển thị sau khi backend được restart để cập nhật dữ liệu mới.
                      </p>
                    )}

                    <Link
                      to={`/vendor/${vendorId}`}
                      className={styles.vendorProfileLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Xem toàn bộ hồ sơ &amp; dịch vụ của nhà cung cấp
                    </Link>
                  </div>
                </div>
              );
            })()}


            {/* Chi tiết về dịch vụ */}

            <div className={styles.detailsCard}>
              <h3 className={styles.sectionTitle}>Mô tả chi tiết</h3>
              <p className={styles.descriptionText}>{service.description}</p>
            </div>

            {/* Thông số kỹ thuật so sánh */}
            {(() => {
              const attrs = getEnrichedAttributes(service);
              
              const specLabels = {
                status: "Trạng thái nhận lịch",
                depositPolicy: "Chính sách đặt cọc",
                cancellationPolicy: "Chính sách hủy lịch",
                responseTime: "Thời gian phản hồi",
                minPrice: "Giá tối thiểu ước tính",
                maxPrice: "Giá tối đa ước tính",
                promotion: "Ưu đãi hiện có",

                // nha_hang
                capacity: "Sức chứa tối đa",
                minTables: "Số bàn tối thiểu",
                pricePerTable: "Khoảng giá mỗi bàn",
                sampleMenu: "Thực đơn mẫu",
                hallType: "Loại sảnh tiệc",
                stage: "Sân khấu & Bục phát biểu",
                soundLighting: "Hệ thống âm thanh ánh sáng",
                parking: "Bãi đỗ xe",
                serviceFee: "Phí dịch vụ & VAT",
                eventDuration: "Thời gian tổ chức tiệc",
                decorationIncluded: "Dịch vụ trang trí hoa cưới",

                // trang_diem / chup_anh / shared
                packageType: "Loại gói dịch vụ",
                makeupStyle: "Phong cách trang điểm",
                trialMakeup: "Trang điểm thử trước lễ",
                hairStylingIncluded: "Làm tóc đi kèm",
                duration: "Thời gian thực hiện",
                homeService: "Hỗ trợ tại nhà",
                assistantCount: "Số người hỗ trợ",
                cosmeticsBrand: "Thương hiệu mỹ phẩm",
                travelFee: "Phụ phí di chuyển xa / Đi lại",
                bookingAdvanceTime: "Thời gian đặt lịch trước",

                // xe_hoa
                carType: "Loại xe hoa",
                carModel: "Dòng xe chi tiết",
                carColor: "Màu sắc xe",
                rentalDuration: "Thời gian thuê quy định",
                kmLimit: "Giới hạn số km di chuyển",
                driverIncluded: "Tài xế đi kèm",
                flowerDecoration: "Trang trí xe cưới sẵn",
                overtimeFee: "Phí vượt giờ phụ thu",
                extraKmFee: "Phí vượt số km phụ thu",
                serviceArea: "Khu vực phục vụ",
                depositCondition: "Điều kiện đặt cọc xe",

                // chup_anh specific
                photographyStyle: "Phong cách nhiếp ảnh",
                shootingDuration: "Thời lượng buổi chụp",
                photographerCount: "Số lượng thợ chụp",
                editedPhotos: "Số lượng ảnh chỉnh sửa",
                rawPhotos: "Trả file ảnh gốc",
                videoIncluded: "Quay video phóng sự",
                highlightVideo: "Video Highlight đi kèm",
                albumIncluded: "Album cưới đính kèm",
                shootingLocation: "Địa điểm chụp",
                deliveryTime: "Thời gian bàn giao",

                // vay_cuoi
                outfitType: "Loại trang phục cưới",
                outfitQuantity: "Số lượng đồ trong gói",
                fittingAvailable: "Thử đồ thoải mái",
                sizeAdjustment: "Hỗ trợ chỉnh sửa số đo",
                cleaningFee: "Phí giặt là hấp sấy",
                depositAmount: "Tiền cọc thế chấp",
                damagePolicy: "Chính sách đền bù",
                availableSizes: "Size trang phục sẵn có",
                accessoriesIncluded: "Phụ kiện đi kèm",
                extraDayFee: "Phí thuê quá hạn mỗi ngày",
              };

              const commonKeys = ["status", "depositPolicy", "cancellationPolicy", "responseTime", "promotion"];
              
              const categoryKeys = {
                nha_hang: ["capacity", "minTables", "pricePerTable", "sampleMenu", "hallType", "stage", "soundLighting", "parking", "serviceFee", "eventDuration", "decorationIncluded"],
                trang_diem: ["packageType", "makeupStyle", "trialMakeup", "hairStylingIncluded", "duration", "homeService", "assistantCount", "cosmeticsBrand", "travelFee", "bookingAdvanceTime"],
                xe_hoa: ["carType", "carModel", "carColor", "rentalDuration", "kmLimit", "driverIncluded", "flowerDecoration", "overtimeFee", "extraKmFee", "serviceArea", "depositCondition"],
                chup_anh: ["packageType", "photographyStyle", "shootingDuration", "photographerCount", "editedPhotos", "rawPhotos", "videoIncluded", "highlightVideo", "albumIncluded", "shootingLocation", "deliveryTime", "travelFee"],
                vay_cuoi: ["outfitType", "outfitQuantity", "fittingAvailable", "sizeAdjustment", "cleaningFee", "depositAmount", "damagePolicy", "availableSizes", "accessoriesIncluded", "extraDayFee"]
              };

              const specificKeys = categoryKeys[service.category] || [];

              return (
                <div className={styles.comparisonSpecsCard}>
                  <h3 className={styles.sectionTitle}>Thông số so sánh chi tiết</h3>
                  <p className={styles.sectionSub}>Bản tóm tắt các tiêu chí kỹ thuật phục vụ so sánh và đối chiếu dịch vụ.</p>
                  
                  <div className={styles.specsGrid}>
                    <div className={styles.specsSubSection}>
                      <h4 className={styles.specsSubTitle}>✨ THÔNG SỐ ĐẶC THÙ CHI TIẾT</h4>
                      <div className={styles.specsList}>
                        {specificKeys.map(key => {
                          let val = attrs[key];
                          if (!val) return null;
                          return (
                            <div key={key} className={styles.specItem}>
                              <span className={styles.specLabel}>{specLabels[key] || key}</span>
                              <span className={styles.specVal}>{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className={styles.specsSubSection} style={{ marginTop: "24px" }}>
                      <h4 className={styles.specsSubTitle}>📌 ĐIỀU KHOẢN & DỊCH VỤ CHUNG</h4>
                      <div className={styles.specsList}>
                        {commonKeys.map(key => {
                          let val = attrs[key];
                          if (!val) return null;
                          return (
                            <div key={key} className={styles.specItem}>
                              <span className={styles.specLabel}>{specLabels[key] || key}</span>
                              <span className={styles.specVal}>{val}</span>
                            </div>
                          );
                        })}
                        <div className={styles.specItem}>
                          <span className={styles.specLabel}>Tầm giá ước tính</span>
                          <span className={styles.specVal}>
                            {formatPrice(attrs.minPrice)} — {formatPrice(attrs.maxPrice)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Dịch vụ đi kèm */}
            {service.includedServices && service.includedServices.length > 0 && (
              <div className={styles.includedCard}>
                <h3 className={styles.sectionTitle}>Dịch vụ đi kèm trọn gói</h3>
                <ul className={styles.includedList}>
                  {service.includedServices.map((inc, idx) => (
                    <li key={idx} className={styles.includedItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span className={styles.includedText}>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div className={styles.reviewsSectionCard}>
              <h3 className={styles.sectionTitle}>Đánh giá từ khách hàng ({reviewsList.length})</h3>
              
              {/* Reviews List */}
              {reviewsList.length === 0 ? (
                <p className={styles.noReviewsText}>Dịch vụ này chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
              ) : (
                <div className={styles.reviewsList}>
                  {reviewsList.map((review) => (
                    <div key={review._id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewAuthor}>{review.author}</span>
                        <span className={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className={styles.reviewStars}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`${styles.reviewStar} ${
                              idx < (review.rating || 5) ? styles.starFilled : ""
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className={styles.reviewContent}>{review.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Submit Form */}
              <div className={styles.writeReviewBlock}>
                <h4 className={styles.writeReviewTitle}>Viết nhận xét & Đánh giá</h4>
                {token ? (
                  <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                    <div className={styles.ratingSelectGroup}>
                      <span className={styles.ratingSelectLabel}>Chọn số sao bình chọn:</span>
                      <div className={styles.starsSelector}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`${styles.starBtn} ${
                              (hoverRating || newRating) >= star ? styles.starFilled : ""
                            }`}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.commentInputGroup}>
                      <textarea
                        className={styles.commentTextarea}
                        placeholder="Chia sẻ trải nghiệm thực tế và đánh giá chất lượng của bạn về dịch vụ này..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        required
                      />
                    </div>
                    {formError && <p className={styles.formErrorText}>{formError}</p>}
                    {formSuccess && <p className={styles.formSuccessText}>{formSuccess}</p>}
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className={styles.submitReviewBtn}
                    >
                      {isSubmittingReview ? "Đang gửi..." : "GỬI ĐÁNH GIÁ CỦA BẠN"}
                    </button>
                  </form>
                ) : (
                  <div className={styles.loginPromptContainer}>
                    <p className={styles.loginPromptText}>
                      Vui lòng đăng nhập tài khoản để có thể đánh giá và nhận xét dịch vụ này.
                    </p>
                    <Link to="/login" state={{ from: `/service/${id}` }} className={styles.loginRedirectBtn}>
                      Đăng nhập ngay
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Bảng giá, Chọn gói & Thanh toán */}
          <div className={styles.rightColumn}>
            <div className={styles.checkoutStickyCard}>
              <div className={styles.checkoutHeader}>
                <h3 className={styles.checkoutTitle}>Báo giá & Đặt dịch vụ</h3>
                <p className={styles.checkoutSub}>Lựa chọn gói tiệc và tính toán chi phí thực tế</p>
              </div>

              {/* Danh sách các gói */}
              <div className={styles.packageList}>
                {service.pricingDetails && service.pricingDetails.map((pkg) => {
                  const isChecked = selectedItems.some((item) => item._id === pkg._id);
                  return (
                    <div 
                      key={pkg._id} 
                      className={`${styles.packageCard} ${isChecked ? styles.packageCardSelected : ""}`}
                      onClick={() => handleCheckboxChange(pkg)}
                    >
                      <div className={styles.packageMainRow}>
                        <div className={styles.checkboxContainer}>
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handle on click div
                            className={styles.styledCheckbox}
                          />
                        </div>
                        <div className={styles.packageInfo}>
                          <h4 className={styles.packageName}>{pkg.name}</h4>
                          <span className={styles.packagePrice}>{formatPrice(pkg.price)}</span>
                        </div>
                      </div>
                      <p className={styles.packageDesc}>{pkg.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tổng cộng */}
              <div className={styles.priceSummary}>
                <div className={styles.summaryRow}>
                  <span>Số lượng gói đã chọn:</span>
                  <span className={styles.summaryVal}>{selectedItems.length} gói</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.totalRow}>
                  <span>TỔNG THANH TOÁN:</span>
                  <span className={styles.totalVal}>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Nút thanh toán */}
              <button 
                type="button" 
                className={styles.payBtn}
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.btnSpinner}></div>
                ) : (
                  <>
                    <img src="/vnpay-logo.svg" alt="" className={styles.vnpayIcon} onError={(e) => e.target.style.display="none"} />
                    <span>THANH TOÁN QUA VNPAY</span>
                  </>
                )}
              </button>
              <p className={styles.securePrompt}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Giao dịch được bảo mật và xử lý mô phỏng qua cổng VNPay chính thức.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default ServiceDetailPage;
