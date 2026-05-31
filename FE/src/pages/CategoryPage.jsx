import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer1 from "../components/Footer1";
import styles from "./CategoryPage.module.css";
import { API_URL } from "../config";

// Cấu hình dữ liệu tĩnh cho các danh mục dịch vụ cưới
const categoryConfig = {
  nha_hang: {
    title: "Nhà hàng tổ chức tiệc cưới",
    subtitle: "— BỘ SƯU TẬP 2026 —",
    description: "Khám phá những không gian tiệc cưới sang trọng, thơ mộng và lãng mạn nhất. Được tuyển chọn kỹ lưỡng để lưu giữ trọn vẹn khoảnh khắc thiêng liêng nhất đời bạn.",
    searchPlaceholder: "Tìm theo tên nhà hàng hoặc địa điểm...",
    quickFilters: ["Tất cả", "Tiệc cưới", "Sân vườn", "View biển", "Sang trọng", "Cổ điển"],
    locations: ["Quận 1", "Tây Hồ", "Thảo Điền", "Hoàn Kiếm", "Hội An", "Sơn Trà"],
    amenities: ["Sân vườn", "View biển", "View hồ", "View sông", "Sảnh lớn", "Bãi đỗ xe", "Phòng cô dâu"],
    priceMaxLimit: 10000000,
    priceStep: 500000,
    priceUnit: "đ"
  },
  trang_diem: {
    title: "Trang điểm cô dâu chuyên nghiệp",
    subtitle: "— TỎA SÁNG RẠNG NGỜI —",
    description: "Những chuyên gia trang điểm hàng đầu sẽ tôn vinh vẻ đẹp tự nhiên, giúp cô dâu rạng rỡ và hoàn hảo nhất dưới mọi góc nhìn trong ngày hạnh phúc.",
    searchPlaceholder: "Tìm kiếm chuyên gia trang điểm...",
    quickFilters: ["Tất cả", "Nhẹ nhàng", "Hàn Quốc", "Cá tính", "Sang trọng", "Cổ điển"],
    locations: ["Quận 1", "Hoàn Kiếm", "Tây Hồ", "Thảo Điền"],
    amenities: ["Mỹ phẩm cao cấp", "Theo sát dặm phấn", "Làm tóc đi kèm", "Thử layout trước"],
    priceMaxLimit: 10000000,
    priceStep: 200000,
    priceUnit: "đ"
  },
  xe_hoa: {
    title: "Thuê xe hoa cưới sang trọng",
    subtitle: "— HÀNH TRÌNH HẠNH PHÚC —",
    description: "Đa dạng các dòng xe cưới từ mui trần trẻ trung, siêu xe đẳng cấp cho đến các dòng xe cổ điển được trang trí hoa tươi tinh xảo, tươm tất.",
    searchPlaceholder: "Tìm kiếm dòng xe hoặc dịch vụ thuê...",
    quickFilters: ["Tất cả", "Mui trần", "Xe sang", "Cổ điển", "Hiện đại"],
    locations: ["Quận 1", "Hoàn Kiếm", "Tây Hồ"],
    amenities: ["Có tài xế đi kèm", "Trang trí hoa tươi", "Xe đời mới", "Siêu xe sang trọng"],
    priceMaxLimit: 15000000,
    priceStep: 500000,
    priceUnit: "đ"
  },
  chup_anh: {
    title: "Chụp ảnh cưới & Phóng sự cưới",
    subtitle: "— LƯU GIỮ KHOẢNH KHẮC —",
    description: "Những khung hình đầy cảm xúc, bắt trọn từng khoảnh khắc tự nhiên, nụ cười hạnh phúc và những giọt nước mắt ngọt ngào của đôi bạn trẻ.",
    searchPlaceholder: "Tìm kiếm studio hoặc nhiếp ảnh gia...",
    quickFilters: ["Tất cả", "Chụp Studio", "Chụp ngoại cảnh", "Phóng sự cưới", "Ngoại tỉnh"],
    locations: ["Quận 1", "Hoàn Kiếm", "Tây Hồ", "Hai Bà Trưng"],
    amenities: ["Chụp ngoại cảnh", "Chụp studio", "Hỗ trợ trang phục", "Photobook cao cấp", "Chụp tại nước ngoài"],
    priceMaxLimit: 30000000,
    priceStep: 1000000,
    priceUnit: "đ"
  },
  vay_cuoi: {
    title: "Thuê váy cưới & Vest cưới thiết kế",
    subtitle: "— LỘNG LẪY & LỊCH LÃM —",
    description: "Những mẫu váy cưới thiết kế tinh xảo, đính kết thủ công lộng lẫy và những bộ suit vest chú rể lịch lãm giúp cả hai trở thành cặp đôi hoàn mỹ nhất.",
    searchPlaceholder: "Tìm thương hiệu váy cưới hoặc vest...",
    quickFilters: ["Tất cả", "Váy cưới", "Vest chú rể", "Váy thiết kế", "Nhập khẩu"],
    locations: ["Quận 1", "Hoàn Kiếm", "Tây Hồ"],
    amenities: ["Váy cưới thiết kế", "Nhập khẩu cao cấp", "Hỗ trợ chỉnh sửa", "Có kèm phụ kiện", "May đo riêng biệt"],
    priceMaxLimit: 50000000,
    priceStep: 1000000,
    priceUnit: "đ"
  }
};

const CategoryPage = ({ defaultCategory }) => {
  const { categoryType } = useParams();
  const navigate = useNavigate();
  
  // Xác định danh mục hiện tại (nếu từ route /nha_hang thì dùng defaultCategory)
  const currentCategory = categoryType || defaultCategory || "nha_hang";
  const config = categoryConfig[currentCategory] || categoryConfig.nha_hang;

  // State Tìm kiếm & Lọc
  const [searchInput, setSearchInput] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("Tất cả");
  const [priceMax, setPriceMax] = useState(config.priceMaxLimit);
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  
  // UI Toggles
  const [viewMode, setViewMode] = useState("grid"); // "grid" hoặc "map"
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Dữ liệu lấy từ API
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Đồng bộ lại giá trị tối đa của giá khi chuyển danh mục
  useEffect(() => {
    setPriceMax(config.priceMaxLimit);
    setSearchInput("");
    setActiveQuickFilter("Tất cả");
    setMinCapacity(0);
    setSelectedLocations([]);
    setSelectedAmenities([]);
    setSortBy("default");
    
    // Đọc danh sách yêu thích từ localStorage
    const savedFavs = localStorage.getItem("wedding_favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, [currentCategory, config]);

  // Gọi API lấy dữ liệu mỗi khi bộ lọc thay đổi
  useEffect(() => {
    setLoading(true);
    let url = `${API_URL}/api/services?category=${currentCategory}`;

    // Lọc theo search input
    if (searchInput) {
      url += `&search=${encodeURIComponent(searchInput)}`;
    } else if (activeQuickFilter !== "Tất cả") {
      // Tận dụng thanh tìm kiếm / quick filter ở backend
      url += `&search=${encodeURIComponent(activeQuickFilter)}`;
    }

    // Khoảng giá
    url += `&priceMax=${priceMax}`;

    // Sức chứa (nếu là nhà hàng)
    if (currentCategory === "nha_hang" && minCapacity > 0) {
      url += `&capacity=${minCapacity}`;
    }

    // Khu vực
    if (selectedLocations.length > 0) {
      url += `&location=${encodeURIComponent(selectedLocations.join(","))}`;
    }

    // Tiện ích
    if (selectedAmenities.length > 0) {
      url += `&amenities=${encodeURIComponent(selectedAmenities.join(","))}`;
    }

    // Sắp xếp
    if (sortBy !== "default") {
      url += `&sort=${sortBy}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch services:", err);
        setLoading(false);
      });
  }, [currentCategory, searchInput, activeQuickFilter, priceMax, minCapacity, selectedLocations, selectedAmenities, sortBy]);

  // Xử lý nút Reset bộ lọc
  const handleResetFilters = () => {
    setPriceMax(config.priceMaxLimit);
    setMinCapacity(0);
    setSelectedLocations([]);
    setSelectedAmenities([]);
    setSearchInput("");
    setActiveQuickFilter("Tất cả");
    setSortBy("default");
  };

  // Toggle khu vực
  const handleLocationToggle = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter((item) => item !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  // Toggle tiện ích
  const handleAmenityToggle = (ame) => {
    if (selectedAmenities.includes(ame)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== ame));
    } else {
      setSelectedAmenities([...selectedAmenities, ame]);
    }
  };

  // Toggle yêu thích (Favorite)
  const handleFavoriteToggle = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    let updated;
    if (favorites.includes(id)) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("wedding_favorites", JSON.stringify(updated));
  };

  // Format hiển thị tiền VNĐ
  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className={styles.container}>
      <Header1 />
      
      <main className={styles.mainContent}>
        {/* Section Hero */}
        <section className={styles.hero}>
          <span className={styles.subTitle}>{config.subtitle}</span>
          <h1 className={styles.mainTitle}>{config.title}</h1>
          <p className={styles.description}>{config.description}</p>

          {/* Ô Tìm Kiếm chính */}
          <form 
            className={styles.searchBar} 
            onSubmit={(e) => {
              e.preventDefault();
              const term = e.target.search.value;
              setSearchInput(term);
            }}
          >
            <input
              type="text"
              name="search"
              placeholder={config.searchPlaceholder}
              className={styles.searchInput}
              defaultValue={searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              TÌM KIẾM
            </button>
          </form>

          {/* Quick Filters */}
          <div className={styles.quickTags}>
            {config.quickFilters.map((tag) => (
              <button
                key={tag}
                type="button"
                className={[
                  styles.tagButton,
                  activeQuickFilter === tag ? styles.activeTag : ""
                ].join(" ")}
                onClick={() => {
                  setActiveQuickFilter(tag);
                  setSearchInput(""); // reset search input để dùng quick tag
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Thanh Điều khiển Phụ (Control Bar) */}
        <div className={styles.controlsBar}>
          <div className={styles.resultsCount}>
            {services.length} {currentCategory === "nha_hang" ? "nhà hàng" : "dịch vụ"} phù hợp
          </div>
          
          <div className={styles.rightControls}>
            {/* Toggle Lưới / Bản đồ */}
            <div className={styles.viewToggles}>
              <button
                className={[
                  styles.viewToggleBtn,
                  viewMode === "grid" ? styles.activeViewToggle : ""
                ].join(" ")}
                onClick={() => setViewMode("grid")}
              >
                ☰ LƯỚI
              </button>
              <button
                className={[
                  styles.viewToggleBtn,
                  viewMode === "map" ? styles.activeViewToggle : ""
                ].join(" ")}
                onClick={() => setViewMode("map")}
              >
                BẢN ĐỒ
              </button>
            </div>

            {/* Dropdown Sắp xếp */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="default">PHỔ BIẾN NHẤT</option>
              <option value="price_asc">GIÁ TĂNG DẦN</option>
              <option value="price_desc">GIÁ GIẢM DẦN</option>
              <option value="popular">ĐÁNH GIÁ TỐT NHẤT</option>
            </select>
          </div>
        </div>

        {/* Nút lọc trượt trên Mobile */}
        <button 
          className={styles.mobileFilterToggle}
          onClick={() => setMobileFilterOpen(true)}
        >
          🔍 BỘ LỌC NÂNG CAO
        </button>

        {/* Bố cục chính */}
        <div className={styles.bodyLayout}>
          {/* Overlay cho Mobile filter */}
          {mobileFilterOpen && (
            <div 
              className={styles.sidebarOverlay} 
              onClick={() => setMobileFilterOpen(false)}
            />
          )}

          {/* Sidebar - Bộ lọc bên trái */}
          <aside className={[
            styles.sidebar,
            mobileFilterOpen ? styles.sidebarOpen : ""
          ].join(" ")}>
            <div className={styles.sidebarHeader}>
              <h2 className={styles.sidebarTitle}>Bộ lọc</h2>
              {mobileFilterOpen && (
                <button 
                  className={styles.resetBtn} 
                  style={{ marginRight: 16 }}
                  onClick={() => setMobileFilterOpen(false)}
                >
                  Đóng ✕
                </button>
              )}
              <button 
                type="button" 
                className={styles.resetBtn}
                onClick={handleResetFilters}
              >
                Đặt lại
              </button>
            </div>

            {/* Bộ lọc Khoảng giá */}
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>Khoảng giá tối đa</span>
              <div className={styles.rangeInputs}>
                <input
                  type="range"
                  min="0"
                  max={config.priceMaxLimit}
                  step={config.priceStep}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.rangeValues}>
                  <span>Dưới:</span>
                  <span style={{ fontWeight: 600, color: "#c3937c" }}>
                    {formatPrice(priceMax)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bộ lọc Sức chứa - Chỉ hiển thị cho Nhà Hàng */}
            {currentCategory === "nha_hang" && (
              <div className={styles.filterSection}>
                <span className={styles.filterLabel}>Sức chứa tối thiểu</span>
                <div className={styles.rangeInputs}>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(Number(e.target.value))}
                    className={styles.rangeSlider}
                  />
                  <div className={styles.rangeValues}>
                    <span>Sức chứa:</span>
                    <span style={{ fontWeight: 600, color: "#c3937c" }}>
                      {minCapacity === 0 ? "Bất kỳ" : `${minCapacity} khách`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bộ lọc Khu vực */}
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>Khu vực</span>
              <div className={styles.locationTags}>
                {config.locations.map((loc) => {
                  const isActive = selectedLocations.includes(loc);
                  return (
                    <button
                      key={loc}
                      type="button"
                      className={[
                        styles.locationTag,
                        isActive ? styles.activeLocationTag : ""
                      ].join(" ")}
                      onClick={() => handleLocationToggle(loc)}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bộ lọc Tiện ích */}
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>Tiện ích / Đặc điểm</span>
              <div className={styles.checkboxList}>
                {config.amenities.map((ame) => {
                  const isChecked = selectedAmenities.includes(ame);
                  return (
                    <label key={ame} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(ame)}
                        className={styles.checkboxInput}
                      />
                      <span>{ame}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Danh sách thẻ bên phải */}
          <section style={{ width: "100%" }}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p style={{ color: "#787878", fontSize: 14 }}>Đang tìm các dịch vụ tốt nhất...</p>
              </div>
            ) : viewMode === "map" ? (
              /* Bản đồ Visual Mockup */
              <div style={{
                backgroundColor: "#ffffff",
                height: 500,
                borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: 24,
                textAlign: "center"
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800" 
                  alt="Bản đồ"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.15,
                    pointerEvents: "none"
                  }}
                />
                <div style={{ zIndex: 1, maxWidth: 450 }}>
                  <div style={{ marginBottom: 16, color: "#4d5637" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <h3 className={styles.emptyTitle}>Tính năng Bản Đồ Đang Trực Quan Hóa</h3>
                  <p className={styles.emptyDesc}>
                    Hệ thống đang tích hợp hiển thị vị trí các nhà cung cấp cưới trên Google Maps để hai bạn dễ dàng lựa chọn khu vực tối ưu.
                  </p>
                  <button 
                    type="button" 
                    className={styles.searchButton}
                    onClick={() => setViewMode("grid")}
                    style={{ marginTop: 8 }}
                  >
                    Xem Dạng Lưới Danh Sách
                  </button>
                </div>
              </div>
            ) : services.length === 0 ? (
              /* Trống kết quả */
              <div className={styles.emptyState}>
                <div style={{ marginBottom: 16, color: "#4d5637" }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 22C2 22 8 18 12 14C16 10 22 2 22 2C22 2 14 8 10 12C6 16 2 22 2 22Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14C12 14 14 12 16 10" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 12C10 12 12 10 14 8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className={styles.emptyTitle}>Không tìm thấy dịch vụ phù hợp</h3>
                <p className={styles.emptyDesc}>
                  Hãy thử điều chỉnh lại bộ lọc giá, đổi tiện ích hoặc thay đổi cụm từ tìm kiếm của bạn.
                </p>
                <button 
                  type="button" 
                  className={styles.searchButton}
                  onClick={handleResetFilters}
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              /* Lưới sản phẩm thực sự */
              <div className={styles.cardsGrid}>
                {services.map((item) => {
                  const isFav = favorites.includes(item._id);
                  return (
                    <article 
                      key={item._id} 
                      className={styles.card}
                      onClick={() => navigate(`/service/${item._id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Ảnh & Badge */}
                      <div className={styles.imageWrapper}>
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600"}
                          alt={item.name}
                          className={styles.cardImage}
                          loading="lazy"
                        />
                        {item.badge && (
                          <div className={[
                            styles.badge,
                            item.badge === "ƯU ĐÃI" ? styles.badgeHighlight : ""
                          ].join(" ")}>
                            {item.badge}
                          </div>
                        )}
                        {/* Nút Trái tim */}
                        <button
                          type="button"
                          className={[
                            styles.favoriteBtn,
                            isFav ? styles.favoriteActive : ""
                          ].join(" ")}
                          onClick={(e) => handleFavoriteToggle(item._id, e)}
                          aria-label="Yêu thích"
                        >
                          <span className={styles.heartIcon}>♥</span>
                        </button>
                      </div>

                      {/* Thông tin Body Card */}
                      <div className={styles.cardBody}>
                        <div className={styles.cardHeader}>
                          <h3 className={styles.cardTitle}>{item.name}</h3>
                          <div className={styles.rating}>
                            <span className={styles.starIcon}>★</span>
                            <span>{item.rating}</span>
                            {item.reviewsCount > 0 && (
                              <span className={styles.reviewsCountText}>
                                ({item.reviewsCount})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Meta thông tin */}
                        <div className={styles.metaInfo}>
                          <div className={styles.metaItem}>
                            <span className={styles.metaIcon}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                <circle cx="12" cy="10" r="3" />
                              </svg>
                            </span>
                            <span>{item.address}</span>
                          </div>
                          {item.capacity > 0 && (
                            <div className={styles.metaItem}>
                              <span className={styles.metaIcon}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                                </svg>
                              </span>
                              <span>Sức chứa lên tới {item.capacity} khách</span>
                            </div>
                          )}
                          {item.amenities && item.amenities.length > 0 && (
                            <div className={styles.metaItem} style={{ flexWrap: "wrap", marginTop: 4 }}>
                              {item.amenities.slice(0, 3).map((ame) => (
                                <span 
                                  key={ame} 
                                  style={{
                                    fontSize: 10,
                                    backgroundColor: "rgba(77, 86, 55, 0.05)",
                                    color: "#4d5637",
                                    padding: "2px 6px",
                                    borderRadius: 2,
                                    marginRight: 4
                                  }}
                                >
                                  {ame}
                                </span>
                              ))}
                              {item.amenities.length > 3 && (
                                <span style={{ fontSize: 10, color: "#b0b0b0" }}>
                                  +{item.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Footer Card */}
                        <div className={styles.cardFooter}>
                          <div className={styles.priceWrapper}>
                            <span className={styles.priceFrom}>GIÁ DỰ KIẾN</span>
                            <span className={styles.priceVal}>
                              {item.priceLabel || formatPrice(item.price)}
                            </span>
                          </div>
                          
                          <span className={styles.actionLink}>
                            CHI TIẾT
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default CategoryPage;
