import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer1 from "../components/Footer1";
import styles from "./CategoryPage.module.css";
import { API_URL } from "../config";

// Configuration data for wedding categories
const categoryConfig = {
  nha_hang: {
    title: "Nhà hàng tổ chức tiệc cưới",
    subtitle: "— BỘ SƯU TẬP KHÔNG GIAN 2026 —",
    description: "Khám phá những không gian tiệc cưới sang trọng, thơ mộng và lãng mạn nhất. Được tuyển chọn kỹ lưỡng để lưu giữ trọn vẹn khoảnh khắc thiêng liêng nhất đời bạn.",
    searchPlaceholder: "Tìm theo tên nhà hàng hoặc địa điểm...",
    quickFilters: ["Tất cả", "Tiệc cưới", "Sân vườn", "View biển", "Sang trọng", "Cổ điển"],
    locations: ["Quận 1", "Tây Hồ", "Thảo Điền", "Hoàn Kiếm", "Hội An", "Sơn Trà"],
    amenities: ["Sân vườn", "View biển", "View hồ", "View sông", "Sảnh lớn", "Bãi đỗ xe", "Phòng cô dâu"],
    priceMaxLimit: 100000000,
    priceStep: 1000000,
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
    priceMaxLimit: 100000000,
    priceStep: 1000000,
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
    priceMaxLimit: 100000000,
    priceStep: 1000000,
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
    priceMaxLimit: 100000000,
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
    priceMaxLimit: 100000000,
    priceStep: 1000000,
    priceUnit: "đ"
  }
};

const CategoryPage = ({ defaultCategory }) => {
  const { categoryType } = useParams();
  const navigate = useNavigate();
  
  // Determine current category
  const currentCategory = categoryType || defaultCategory || "nha_hang";
  const config = categoryConfig[currentCategory] || categoryConfig.nha_hang;

  // Search & Filter States
  const [searchInput, setSearchInput] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("Tất cả");
  const [priceMax, setPriceMax] = useState(config.priceMaxLimit);
  const [minCapacity, setMinCapacity] = useState(0);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("default");
  
  // UI Toggles
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Fetch data
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Sync state values on category changes
  useEffect(() => {
    setPriceMax(config.priceMaxLimit);
    setSearchInput("");
    setActiveQuickFilter("Tất cả");
    setMinCapacity(0);
    setSelectedLocations([]);
    setSelectedAmenities([]);
    setSortBy("default");
    setCurrentPage(1);
    
    const savedFavs = localStorage.getItem("wedding_favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }
  }, [currentCategory, config]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, activeQuickFilter, priceMax, minCapacity, selectedLocations, selectedAmenities, sortBy]);

  // Fetch services from API
  useEffect(() => {
    setLoading(true);
    let url = `${API_URL}/api/services?category=${currentCategory}`;

    if (searchInput) {
      url += `&search=${encodeURIComponent(searchInput)}`;
    } else if (activeQuickFilter !== "Tất cả") {
      url += `&search=${encodeURIComponent(activeQuickFilter)}`;
    }

    url += `&priceMax=${priceMax}`;

    if (currentCategory === "nha_hang" && minCapacity > 0) {
      url += `&capacity=${minCapacity}`;
    }

    if (selectedLocations.length > 0) {
      url += `&location=${encodeURIComponent(selectedLocations.join(","))}`;
    }

    if (selectedAmenities.length > 0) {
      url += `&amenities=${encodeURIComponent(selectedAmenities.join(","))}`;
    }

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
        console.error("Error fetching services:", err);
        setLoading(false);
      });
  }, [currentCategory, searchInput, activeQuickFilter, priceMax, minCapacity, selectedLocations, selectedAmenities, sortBy]);

  const handleResetFilters = () => {
    setPriceMax(config.priceMaxLimit);
    setMinCapacity(0);
    setSelectedLocations([]);
    setSelectedAmenities([]);
    setSearchInput("");
    setActiveQuickFilter("Tất cả");
    setSortBy("default");
  };

  const handleLocationToggle = (loc) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter((item) => item !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  const handleAmenityToggle = (ame) => {
    if (selectedAmenities.includes(ame)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== ame));
    } else {
      setSelectedAmenities([...selectedAmenities, ame]);
    }
  };

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

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = services.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const getHeroBackground = () => {
    switch (currentCategory) {
      case "nha_hang":
        return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1600";
      case "trang_diem":
        return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1600";
      case "xe_hoa":
        return "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600";
      case "chup_anh":
        return "https://images.unsplash.com/photo-1537907690979-ee8e01276184?q=80&w=1600";
      default:
        return "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=1600";
    }
  };

  return (
    <div className={styles.container}>
      <Header1 />
      
      <main className={styles.mainContent}>
        {/* Modern Hero Search Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroBgWrapper}>
            <img src={getHeroBackground()} alt="Hero Background" className={styles.heroBgImage} />
            <div className={styles.heroOverlay} />
          </div>
          
          <div className={styles.heroContent}>
            <span className={styles.heroSub}>{config.subtitle}</span>
            <h1 className={styles.heroTitle}>{config.title}</h1>
            <p className={styles.heroDesc}>{config.description}</p>

            {/* Immersive Floating Discovery Panel */}
            <div className={styles.discoveryPanel}>
              <form 
                className={styles.searchForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  setSearchInput(e.target.search.value);
                }}
              >
                <div className={styles.searchFieldsGrid}>
                  {/* Search Keyword */}
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Từ khóa</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>🔍</span>
                      <input
                        type="text"
                        name="search"
                        placeholder={config.searchPlaceholder}
                        className={styles.discoveryInput}
                        defaultValue={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Khu vực</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>📍</span>
                      <select 
                        className={styles.discoverySelect}
                        value={selectedLocations[0] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedLocations(val ? [val] : []);
                        }}
                      >
                        <option value="">Tất cả khu vực</option>
                        {config.locations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Capacity Selector (nha_hang specific) */}
                  {currentCategory === "nha_hang" && (
                    <div className={styles.inputGroup}>
                      <label className={styles.inputLabel}>Sức chứa</label>
                      <div className={styles.inputWrapper}>
                        <span className={styles.inputIcon}>👥</span>
                        <select
                          className={styles.discoverySelect}
                          value={minCapacity}
                          onChange={(e) => setMinCapacity(Number(e.target.value))}
                        >
                          <option value="0">Bất kỳ sức chứa</option>
                          <option value="150">Trên 150 khách</option>
                          <option value="300">Trên 300 khách</option>
                          <option value="500">Trên 500 khách</option>
                          <option value="800">Trên 800 khách</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Price budget */}
                  <div className={styles.inputGroup}>
                    <label className={styles.inputLabel}>Ngân sách tối đa</label>
                    <div className={styles.inputWrapper}>
                      <span className={styles.inputIcon}>💰</span>
                      <select
                        className={styles.discoverySelect}
                        value={priceMax}
                        onChange={(e) => setPriceMax(Number(e.target.value))}
                      >
                        <option value={config.priceMaxLimit}>Mọi mức giá</option>
                        <option value="5000000">Dưới 5.000.000đ</option>
                        <option value="15000000">Dưới 15.000.000đ</option>
                        <option value="30000000">Dưới 30.000.000đ</option>
                        <option value="60000000">Dưới 60.000.000đ</option>
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <div className={styles.searchBtnGroup}>
                    <span className={styles.btnSpacerLabel}>&nbsp;</span>
                    <button type="submit" className={styles.discoverySearchBtn}>
                      TÌM KIẾM
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Quick Filter Chips */}
        <section className={styles.chipsSection}>
          <div className={styles.chipsScroll}>
            {config.quickFilters.map((tag) => (
              <button
                key={tag}
                type="button"
                className={[
                  styles.filterChip,
                  activeQuickFilter === tag ? styles.activeChip : ""
                ].join(" ")}
                onClick={() => {
                  setActiveQuickFilter(tag);
                  setSearchInput("");
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* Sticky Toolbar */}
        <div className={styles.stickyToolbar}>
          <div className={styles.toolbarInner}>
            <div className={styles.resultsCount}>
              <span>{services.length}</span> {currentCategory === "nha_hang" ? "không gian tiệc" : "nhà cung cấp"} được tìm thấy
            </div>
            
            <div className={styles.toolbarActions}>
              {/* Reset filter indicator */}
              {(selectedLocations.length > 0 || selectedAmenities.length > 0 || minCapacity > 0 || searchInput !== "" || activeQuickFilter !== "Tất cả") && (
                <button className={styles.resetToolbarBtn} onClick={handleResetFilters}>
                  Đặt lại lọc ✕
                </button>
              )}

              {/* View mode toggle */}
              <div className={styles.viewToggleGroup}>
                <button
                  className={`${styles.toolbarActionBtn} ${viewMode === "grid" ? styles.activeActionBtn : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Xem dạng lưới"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                  <span>LƯỚI</span>
                </button>
                <button
                  className={`${styles.toolbarActionBtn} ${viewMode === "map" ? styles.activeActionBtn : ""}`}
                  onClick={() => setViewMode("map")}
                  title="Xem bản đồ"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                    <line x1="9" y1="3" x2="9" y2="18"/>
                    <line x1="15" y1="6" x2="15" y2="21"/>
                  </svg>
                  <span>BẢN ĐỒ</span>
                </button>
              </div>

              {/* Sort dropdown */}
              <div className={styles.sortDropdownWrapper}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.sortSelect}
                >
                  <option value="default">✨ PHỔ BIẾN NHẤT</option>
                  <option value="price_asc">📈 GIÁ TĂNG DẦN</option>
                  <option value="price_desc">📉 GIÁ GIẢM DẦN</option>
                  <option value="popular">⭐ ĐÁNH GIÁ TỐT</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                className={styles.mobileFilterBtn}
                onClick={() => setMobileFilterOpen(true)}
              >
                🎛 BỘ LỌC
              </button>
            </div>
          </div>
        </div>

        {/* Discovery Layout Grid & Filters */}
        <div className={styles.discoveryLayout}>
          {/* Sidebar Filters Drawer */}
          {mobileFilterOpen && (
            <div className={styles.drawerOverlay} onClick={() => setMobileFilterOpen(false)} />
          )}

          <aside className={[
            styles.filterSidebar,
            mobileFilterOpen ? styles.sidebarDrawerOpen : ""
          ].join(" ")}>
            <div className={styles.sidebarHeader}>
              <h3>Bộ lọc nâng cao</h3>
              <div className={styles.sidebarHeaderActions}>
                <button className={styles.resetSidebarBtn} onClick={handleResetFilters}>Đặt lại</button>
                {mobileFilterOpen && (
                  <button className={styles.closeDrawerBtn} onClick={() => setMobileFilterOpen(false)}>✕</button>
                )}
              </div>
            </div>

            <div className={styles.sidebarContent}>
              {/* Price slider */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Mức giá giới hạn</h4>
                <div className={styles.sliderContainer}>
                  <input
                    type="range"
                    min="0"
                    max={config.priceMaxLimit}
                    step={config.priceStep}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className={styles.modernSlider}
                  />
                  <div className={styles.sliderValues}>
                    <span>Dưới</span>
                    <strong>{formatPrice(priceMax)}</strong>
                  </div>
                </div>
              </div>

              {/* Capacity slider (nha_hang specific) */}
              {currentCategory === "nha_hang" && (
                <div className={styles.filterGroup}>
                  <h4 className={styles.filterGroupTitle}>Sức chứa tối thiểu</h4>
                  <div className={styles.sliderContainer}>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="50"
                      value={minCapacity}
                      onChange={(e) => setMinCapacity(Number(e.target.value))}
                      className={styles.modernSlider}
                    />
                    <div className={styles.sliderValues}>
                      <span>Tối thiểu</span>
                      <strong>{minCapacity === 0 ? "Bất kỳ" : `${minCapacity} khách`}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Locations Checklist */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Khu vực</h4>
                <div className={styles.checklistGrid}>
                  {config.locations.map((loc) => {
                    const isChecked = selectedLocations.includes(loc);
                    return (
                      <label key={loc} className={styles.checkLabel}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleLocationToggle(loc)}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkText}>{loc}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Amenities Checklist */}
              <div className={styles.filterGroup}>
                <h4 className={styles.filterGroupTitle}>Tiện ích & Dịch vụ đi kèm</h4>
                <div className={styles.checklistColumn}>
                  {config.amenities.map((ame) => {
                    const isChecked = selectedAmenities.includes(ame);
                    return (
                      <label key={ame} className={styles.checkLabelBlock}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAmenityToggle(ame)}
                          className={styles.checkboxInput}
                        />
                        <span className={styles.checkText}>{ame}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Listing Content Area */}
          <section className={styles.listingSection}>
            {loading ? (
              /* Premium loading skeletons */
              <div className={styles.skeletonGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage} />
                    <div className={styles.skeletonBody}>
                      <div className={styles.skeletonTitle} />
                      <div className={styles.skeletonText} />
                      <div className={styles.skeletonTextSmall} />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === "map" ? (
              /* Map mock view */
              <div className={styles.mapContainer}>
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800" 
                  alt="Bản đồ"
                  className={styles.mapBgImage}
                />
                <div className={styles.mapContent}>
                  <div className={styles.mapIcon}>📍</div>
                  <h3>Khám phá trực quan trên Bản đồ</h3>
                  <p>Hệ thống định vị thông minh đang thiết lập vị trí các đối tác tiệc cưới giúp hai bạn tối ưu quãng đường di chuyển.</p>
                  <button className={styles.mapReturnBtn} onClick={() => setViewMode("grid")}>
                    Quay lại danh sách dạng lưới
                  </button>
                </div>
              </div>
            ) : services.length === 0 ? (
              /* Empty results state */
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h3>Không tìm thấy dịch vụ phù hợp</h3>
                <p>Hãy điều chỉnh lại khoảng ngân sách, chọn khu vực khác hoặc làm sạch các bộ lọc để bắt đầu lại.</p>
                <button className={styles.emptyResetBtn} onClick={handleResetFilters}>
                  Đặt lại tất cả lọc
                </button>
              </div>
            ) : (
              /* Modern Premium Grid Listing */
              <>
                <div className={styles.cardsGrid}>
                  {currentItems.map((item) => {
                    const isFav = favorites.includes(item._id);
                    return (
                      <article 
                        key={item._id} 
                        className={styles.venueCard}
                        onClick={() => navigate(`/service/${item._id}`)}
                      >
                        {/* Immersive Image with badges */}
                        <div className={styles.cardImageWrapper}>
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600"}
                            alt={item.name}
                            className={styles.venueImage}
                            loading="lazy"
                          />
                          
                          {/* Floating badges */}
                          {item.badge && (
                            <span className={`${styles.badge} ${item.badge === "ƯU ĐÃI" ? styles.badgeHighlight : styles.badgeNormal}`}>
                              {item.badge}
                            </span>
                          )}

                          {/* Heart favorite button */}
                          <button
                            type="button"
                            className={`${styles.favBtn} ${isFav ? styles.favBtnActive : ""}`}
                            onClick={(e) => handleFavoriteToggle(item._id, e)}
                            aria-label="Yêu thích"
                          >
                            <svg viewBox="0 0 24 24" fill={isFav ? "#d32f2f" : "none"} stroke={isFav ? "#d32f2f" : "#ffffff"} strokeWidth="2.5" width="20" height="20">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </button>
                        </div>

                        {/* Venue details info */}
                        <div className={styles.venueDetails}>
                          <div className={styles.venueHeader}>
                            <h3 className={styles.venueName}>{item.name}</h3>
                            <div className={styles.ratingInfo}>
                              <span className={styles.ratingStar}>★</span>
                              <strong className={styles.ratingVal}>{item.rating}</strong>
                              {item.reviewsCount > 0 && (
                                <span className={styles.ratingCount}>({item.reviewsCount})</span>
                              )}
                            </div>
                          </div>

                          <p className={styles.venueLocation}>
                            <span className={styles.locIcon}>📍</span> {item.address}
                          </p>

                          <div className={styles.venueSpecs}>
                            {item.capacity > 0 && (
                              <span className={styles.specItem}>
                                👥 Lên tới {item.capacity} khách
                              </span>
                            )}
                            <span className={styles.specItem}>
                              🏷️ {currentCategory === "nha_hang" ? "Địa điểm cưới" : "Dịch vụ cưới"}
                            </span>
                          </div>

                          {/* Amenities labels */}
                          {item.amenities && item.amenities.length > 0 && (
                            <div className={styles.cardTagsRow}>
                              {item.amenities.slice(0, 3).map((ame) => (
                                <span key={ame} className={styles.cardTagLabel}>
                                  {ame}
                                </span>
                              ))}
                              {item.amenities.length > 3 && (
                                <span className={styles.cardTagsMore}>
                                  +{item.amenities.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Pricing and Action row */}
                          <div className={styles.venueFooter}>
                            <div className={styles.priceContainer}>
                              <span className={styles.priceTitle}>GIÁ DỰ KIẾN</span>
                              <strong className={styles.priceValue}>
                                {item.priceLabel || formatPrice(item.price)}
                              </strong>
                            </div>
                            
                            <button type="button" className={styles.cardActionBtn}>
                              Chi tiết 
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {/* Modern Pagination controls */}
                {totalPages > 1 && (
                  <div className={styles.paginationContainer}>
                    <button
                      type="button"
                      className={styles.arrowPageBtn}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ←
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        className={`${styles.pageNumBtn} ${currentPage === pageNum ? styles.activePageNumBtn : ""}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      className={styles.arrowPageBtn}
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default CategoryPage;
