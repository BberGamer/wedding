import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./VendorDashboard.module.css";
import { API_URL } from "../config";

const categoryLabels = {
  nha_hang: "Nhà hàng tiệc cưới",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa ngày cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế"
};

const categoryIcons = {
  nha_hang: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M3 21h18M3 7v14M21 7v14M12 3v18M12 7h9M3 7h9M7 11h2M7 15h2M15 11h2M15 15h2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  trang_diem: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M12 2a6 6 0 0 0-6 6v8a6 6 0 0 0 12 0V8a6 6 0 0 0-6-6zM12 18v3M9 21h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  xe_hoa: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <rect x="2" y="10" width="20" height="8" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5M6 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  chup_anh: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  vay_cuoi: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 6, verticalAlign: "middle", display: "inline-block" }}>
      <path d="M12 2L4 9v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM12 2v20M8 9h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

const initialFormState = {
  name: "",
  category: "nha_hang",
  address: "",
  location: "Quận 1",
  price: 5000000,
  priceLabel: "Giá từ 5.000.000đ",
  badge: "MỚI",
  phone: "0901 234 567",
  website: "https://anwedding.com",
  facebook: "https://facebook.com/anwedding",
  description: "Dịch vụ cưới hỏi chất lượng cao, mang lại trải nghiệm tuyệt vời và đáng nhớ cho ngày hạnh phúc của bạn.",
  includedServices: [],
  amenities: [],
  image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600",
  album: [],
  pricingDetails: [
    { name: "Gói cơ bản", price: 5000000, desc: "Dịch vụ cơ bản trọn gói ngày cưới" }
  ]
};

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState(null);
  
  // Form values
  const [formData, setFormData] = useState(initialFormState);
  const [activeTab, setActiveTab] = useState("basic");
  
  // Custom inputs for tag elements
  const [tempIncluded, setTempIncluded] = useState("");
  const [tempAmenity, setTempAmenity] = useState("");
  const [tempAlbumUrl, setTempAlbumUrl] = useState("");

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== "vendor" && parsedUser.role !== "admin") {
      alert("Bạn không có quyền truy cập trang quản trị này.");
      navigate("/");
      return;
    }

    setUser(parsedUser);
    setToken(storedToken);
    fetchServices(storedToken);
  }, [navigate]);

  const fetchServices = async (authToken) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/services/vendor/my-services`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      } else {
        console.error("Không thể lấy danh sách dịch vụ");
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  // Included Services tag manager
  const addIncludedService = () => {
    if (tempIncluded.trim()) {
      setFormData((prev) => ({
        ...prev,
        includedServices: [...prev.includedServices, tempIncluded.trim()]
      }));
      setTempIncluded("");
    }
  };

  const removeIncludedService = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      includedServices: prev.includedServices.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Amenities tag manager
  const addAmenity = () => {
    if (tempAmenity.trim()) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, tempAmenity.trim()]
      }));
      setTempAmenity("");
    }
  };

  const removeAmenity = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Album images manager
  const addAlbumPhoto = () => {
    if (tempAlbumUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        album: [...prev.album, tempAlbumUrl.trim()]
      }));
      setTempAlbumUrl("");
    }
  };

  const removeAlbumPhoto = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      album: prev.album.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Pricing details packages manager
  const addPackage = () => {
    setFormData((prev) => ({
      ...prev,
      pricingDetails: [
        ...prev.pricingDetails,
        { name: "Tên gói mới", price: 1000000, desc: "Mô tả dịch vụ đi kèm gói" }
      ]
    }));
  };

  const updatePackageField = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.pricingDetails];
      updated[index] = {
        ...updated[index],
        [field]: field === "price" ? Number(value) : value
      };
      return {
        ...prev,
        pricingDetails: updated
      };
    });
  };

  const removePackage = (indexToRemove) => {
    if (formData.pricingDetails.length === 1) {
      alert("Dịch vụ của bạn cần có ít nhất 1 gói báo giá!");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      pricingDetails: prev.pricingDetails.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // CRUD actions
  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentServiceId(null);
    setFormData(initialFormState);
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleOpenEditModal = (service) => {
    setIsEditing(true);
    setCurrentServiceId(service._id);
    setFormData({
      name: service.name || "",
      category: service.category || "nha_hang",
      address: service.address || "",
      location: service.location || "",
      price: service.price || 0,
      priceLabel: service.priceLabel || "",
      badge: service.badge || "",
      phone: service.phone || "0901 234 567",
      website: service.website || "https://anwedding.com",
      facebook: service.facebook || "https://facebook.com/anwedding",
      description: service.description || "",
      includedServices: service.includedServices || [],
      amenities: service.amenities || [],
      image: service.image || "",
      album: service.album || [],
      pricingDetails: service.pricingDetails && service.pricingDetails.length > 0
        ? service.pricingDetails.map(p => ({ name: p.name, price: p.price, desc: p.desc, _id: p._id }))
        : [{ name: "Gói cơ bản", price: service.price || 0, desc: "Dịch vụ cơ bản trọn gói ngày cưới" }]
    });
    setActiveTab("basic");
    setShowModal(true);
  };

  const handleDeleteService = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xoá vĩnh viễn dịch vụ "${name}" không?`)) {
      try {
        const res = await fetch(`${API_URL}/api/services/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          alert("Xoá dịch vụ thành công!");
          fetchServices(token);
        } else {
          alert(data.message || "Xoá thất bại");
        }
      } catch (err) {
        alert("Lỗi kết nối máy chủ!");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.location || !formData.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc ở Tab 1!");
      setActiveTab("basic");
      return;
    }

    try {
      const url = isEditing
        ? `${API_URL}/api/services/${currentServiceId}`
        : `${API_URL}/api/services`;
      
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert(isEditing ? "Cập nhật dịch vụ thành công!" : "Tạo dịch vụ mới thành công!");
        setShowModal(false);
        fetchServices(token);
      } else {
        alert(data.message || "Lưu thông tin thất bại!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối máy chủ!");
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  // Filtering services logic
  const filteredServices = services.filter((svc) => {
    const matchesSearch = svc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          svc.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          svc.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || svc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Calculate metrics
  const totalServices = services.length;
  const avgRating = services.length > 0 
    ? (services.reduce((acc, curr) => acc + (curr.rating || 5), 0) / services.length).toFixed(1) 
    : "5.0";
  const totalPackages = services.reduce((acc, curr) => acc + (curr.pricingDetails?.length || 0), 0);

  return (
    <div className={styles.dashboardPage}>
      <SharedHeader theme="light" />

      {/* Decorative patterns */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <img className={styles.bgLeaf} alt="" src="/Layer-1.svg" />

      <main className={styles.container}>
        {/* Banner Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>VENDOR PORTAL</span>
            <h1 className={styles.heroTitle}>Bảng Quản Trị Của Bạn</h1>
            <p className={styles.heroSubtitle}>
              Chào mừng trở lại, <span className={styles.vendorName}>{user?.name}</span>! Quản lý các dịch vụ tiệc cưới cao cấp của bạn và tiếp cận hàng ngàn cặp đôi mỗi ngày.
            </p>
          </div>
        </section>

        {/* Metrics Grid */}
        <section className={styles.metricsSection}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3h12l4 6-10 13L2 9z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Dịch vụ đang chạy</span>
              <h2 className={styles.metricValue}>{totalServices}</h2>
            </div>
            <div className={styles.metricTrend}>+ Hoạt động</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Đánh giá trung bình</span>
              <h2 className={styles.metricValue}>{avgRating} <span className={styles.smallStar}>★</span></h2>
            </div>
            <div className={styles.metricTrend}>Cực kì cao</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Tổng số gói báo giá</span>
              <h2 className={styles.metricValue}>{totalPackages}</h2>
            </div>
            <div className={styles.metricTrend}>Đa dạng mức giá</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Giao dịch VNPay</span>
              <h2 className={styles.metricValue}>Mô phỏng</h2>
            </div>
            <div className={styles.metricTrend}>Tích hợp sẵn</div>
          </div>
        </section>

        {/* Controls Row (Search, Filter, Add button) */}
        <section className={styles.controlsRow}>
          <div className={styles.searchFilterGroup}>
            <div className={styles.searchWrapper}>
              <span className={styles.searchIcon}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Tìm tên, địa chỉ, quận huyện..."
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.filterWrapper}>
              <select
                className={styles.filterSelect}
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Tất cả dịch vụ</option>
                <option value="nha_hang">Nhà hàng tiệc cưới</option>
                <option value="trang_diem">Trang điểm cô dâu</option>
                <option value="xe_hoa">Xe hoa ngày cưới</option>
                <option value="chup_anh">Chụp ảnh cưới</option>
                <option value="vay_cuoi">Váy & vest cưới</option>
              </select>
            </div>
          </div>

          <button className={styles.addBtn} onClick={handleOpenAddModal}>
            <span className={styles.addBtnIcon}>+</span> Đăng dịch vụ mới
          </button>
        </section>

        {/* Services List Grid */}
        <section className={styles.listSection}>
          {loading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu dịch vụ của bạn...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>Không tìm thấy dịch vụ phù hợp</h3>
              <p>Bạn chưa đăng tải dịch vụ cưới nào trong chuyên mục này hoặc thông tin tìm kiếm không trùng khớp.</p>
              {services.length === 0 && (
                <button className={styles.addBtnEmpty} onClick={handleOpenAddModal}>
                  Bắt đầu đăng dịch vụ đầu tiên
                </button>
              )}
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredServices.map((svc) => (
                <div key={svc._id} className={styles.serviceCard}>
                  {/* Image & Badge */}
                  <div className={styles.cardImageArea}>
                    <img src={svc.image} alt={svc.name} className={styles.cardImg} />
                    <span className={styles.cardCategoryBadge}>
                      {categoryIcons[svc.category]} {categoryLabels[svc.category] || svc.category}
                    </span>
                    {svc.badge && <span className={styles.cardBadge}>{svc.badge}</span>}
                  </div>

                  {/* Body Info */}
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{svc.name}</h3>
                    <div className={styles.cardRating}>
                      <span className={styles.starIcon}>★</span>
                      <span className={styles.ratingNum}>{svc.rating || "5.0"}</span>
                      <span className={styles.reviewsText}>({svc.reviewsCount || 0} đánh giá)</span>
                    </div>

                    <div className={styles.cardInfoItem}>
                      <span className={styles.infoIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </span>
                      <span className={styles.infoText}>{svc.address}</span>
                    </div>

                    <div className={styles.cardInfoItem}>
                      <span className={styles.infoIcon}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle" }}>
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                          <line x1="7" y1="7" x2="7.01" y2="7" />
                        </svg>
                      </span>
                      <span className={styles.infoText}>Giá tham khảo: <strong>{svc.priceLabel || formatPrice(svc.price)}</strong></span>
                    </div>

                    {/* Quick overview of packages */}
                    {svc.pricingDetails && svc.pricingDetails.length > 0 && (
                      <div className={styles.cardPackagesList}>
                        <span className={styles.pkgSectionTitle}>Các gói báo giá ({svc.pricingDetails.length}):</span>
                        <div className={styles.pkgTagContainer}>
                          {svc.pricingDetails.slice(0, 2).map((pkg, idx) => (
                            <span key={idx} className={styles.miniPkgTag}>{pkg.name}</span>
                          ))}
                          {svc.pricingDetails.length > 2 && <span className={styles.morePkgTag}>+{svc.pricingDetails.length - 2}</span>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Column/Row */}
                  <div className={styles.cardActions}>
                    <Link to={`/service/${svc._id}`} className={styles.actionBtnView} title="Xem trang chi tiết">
                      Xem chi tiết
                    </Link>
                    <div className={styles.editDeleteRow}>
                      <button className={styles.actionBtnEdit} onClick={() => handleOpenEditModal(svc)}>
                        Sửa
                      </button>
                      <button className={styles.actionBtnDelete} onClick={() => handleDeleteService(svc._id, svc.name)}>
                        Xoá
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* High-Fidelity Add/Edit Service Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {isEditing ? "Chỉnh Sửa Dịch Vụ Cưới" : "Đăng Dịch Vụ Cưới Mới"}
              </h2>
              <button className={styles.closeModalBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Modal Tabs navigation */}
            <div className={styles.modalTabs}>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "basic" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("basic")}
              >
                1. Thông tin cơ bản
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "contact" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("contact")}
              >
                2. Liên hệ & Chi tiết
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "services" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("services")}
              >
                3. Tiện ích & Gói kèm
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "images" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("images")}
              >
                4. Album ảnh cưới
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${activeTab === "pricing" ? styles.tabBtnActive : ""}`}
                onClick={() => setActiveTab("pricing")}
              >
                5. Bảng giá dịch vụ
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className={styles.tabPane}>
                  <div className={styles.formGrid2Col}>
                    <div className={styles.formGroup}>
                      <label className={styles.requiredLabel}>Tên thương hiệu / Dịch vụ</label>
                      <input
                        type="text"
                        name="name"
                        className={styles.formInput}
                        placeholder="Ví dụ: Melisa Center, Lavender Studio..."
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.requiredLabel}>Chuyên mục dịch vụ cưới</label>
                      <select
                        name="category"
                        className={styles.formSelect}
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="nha_hang">Nhà hàng tiệc cưới</option>
                        <option value="trang_diem">Trang điểm cô dâu</option>
                        <option value="xe_hoa">Xe hoa ngày cưới</option>
                        <option value="chup_anh">Chụp ảnh cưới</option>
                        <option value="vay_cuoi">Váy & vest cưới</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGrid2Col}>
                    <div className={styles.formGroup}>
                      <label className={styles.requiredLabel}>Địa chỉ chi tiết</label>
                      <input
                        type="text"
                        name="address"
                        className={styles.formInput}
                        placeholder="Ví dụ: 85 Thoại Ngọc Hầu, Phường Hòa Thạnh..."
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.requiredLabel}>Khu vực quận / huyện</label>
                      <input
                        type="text"
                        name="location"
                        className={styles.formInput}
                        placeholder="Ví dụ: Quận 1, Tây Hồ, Sơn Trà..."
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGrid3Col}>
                    <div className={styles.formGroup}>
                      <label className={styles.requiredLabel}>Giá khởi điểm (VNĐ)</label>
                      <input
                        type="number"
                        name="price"
                        className={styles.formInput}
                        placeholder="Ví dụ: 3500000"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Nhãn hiển thị giá</label>
                      <input
                        type="text"
                        name="priceLabel"
                        className={styles.formInput}
                        placeholder="Ví dụ: 3.500.000đ/bàn hoặc Giá từ 5 triệu"
                        value={formData.priceLabel}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Huy hiệu nổi bật (Badge)</label>
                      <input
                        type="text"
                        name="badge"
                        className={styles.formInput}
                        placeholder="Ví dụ: MỚI, NỔI BẬT, ƯU ĐÃI"
                        value={formData.badge}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CONTACT & DESCRIPTION */}
              {activeTab === "contact" && (
                <div className={styles.tabPane}>
                  <div className={styles.formGrid3Col}>
                    <div className={styles.formGroup}>
                      <label>Số điện thoại liên hệ</label>
                      <input
                        type="text"
                        name="phone"
                        className={styles.formInput}
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Website link</label>
                      <input
                        type="text"
                        name="website"
                        className={styles.formInput}
                        value={formData.website}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Facebook fanpage link</label>
                      <input
                        type="text"
                        name="facebook"
                        className={styles.formInput}
                        value={formData.facebook}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Mô tả chi tiết về dịch vụ cưới</label>
                    <textarea
                      name="description"
                      rows="6"
                      className={styles.formTextarea}
                      placeholder="Nhập thông tin giới thiệu chi tiết, thế mạnh của thương hiệu, dịch vụ chất lượng cao của bạn để thu hút cô dâu chú rể..."
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: INCLUDED SERVICES & AMENITIES */}
              {activeTab === "services" && (
                <div className={styles.tabPane}>
                  {/* Included Services Section */}
                  <div className={styles.tagManagerBox}>
                    <h4 className={styles.tagManagerTitle}>Dịch vụ đi kèm trọn gói</h4>
                    <p className={styles.tagManagerSub}>Các ưu đãi được tặng kèm khi chọn dịch vụ của bạn (Ví dụ: Nước uống đón khách, MC dẫn chương trình, Pháo hoa...)</p>
                    <div className={styles.tagInputRow}>
                      <input
                        type="text"
                        placeholder="Nhập dịch vụ tặng kèm..."
                        className={styles.formInput}
                        value={tempIncluded}
                        onChange={(e) => setTempIncluded(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIncludedService())}
                      />
                      <button type="button" className={styles.tagAddBtn} onClick={addIncludedService}>Thêm</button>
                    </div>
                    <div className={styles.tagList}>
                      {formData.includedServices.map((tag, idx) => (
                        <span key={idx} className={styles.tagItem}>
                          {tag}
                          <button type="button" className={styles.tagDeleteBtn} onClick={() => removeIncludedService(idx)}>✕</button>
                        </span>
                      ))}
                      {formData.includedServices.length === 0 && <p className={styles.emptyTagText}>Chưa có dịch vụ đi kèm nào được thêm.</p>}
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className={styles.tagManagerBox} style={{ marginTop: 24 }}>
                    <h4 className={styles.tagManagerTitle}>Tiện ích sẵn có (Amenities)</h4>
                    <p className={styles.tagManagerSub}>Các thế mạnh về mặt cơ sở vật chất hoặc tiện nghi (Ví dụ: Bãi đỗ xe rộng, View sân vườn, Phòng cô dâu, Wifi miễn phí...)</p>
                    <div className={styles.tagInputRow}>
                      <input
                        type="text"
                        placeholder="Nhập tiện ích sẵn có..."
                        className={styles.formInput}
                        value={tempAmenity}
                        onChange={(e) => setTempAmenity(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
                      />
                      <button type="button" className={styles.tagAddBtn} onClick={addAmenity}>Thêm</button>
                    </div>
                    <div className={styles.tagList}>
                      {formData.amenities.map((tag, idx) => (
                        <span key={idx} className={styles.tagItem}>
                          {tag}
                          <button type="button" className={styles.tagDeleteBtn} onClick={() => removeAmenity(idx)}>✕</button>
                        </span>
                      ))}
                      {formData.amenities.length === 0 && <p className={styles.emptyTagText}>Chưa có tiện ích nào được thêm.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: PHOTO ALBUM */}
              {activeTab === "images" && (
                <div className={styles.tabPane}>
                  <div className={styles.formGroup}>
                    <label className={styles.requiredLabel}>Ảnh bìa chính (Cover Image URL)</label>
                    <input
                      type="text"
                      name="image"
                      className={styles.formInput}
                      placeholder="Nhập đường dẫn URL của ảnh bìa..."
                      value={formData.image}
                      onChange={handleInputChange}
                      required
                    />
                    {formData.image && (
                      <div className={styles.previewImageCover}>
                        <p className={styles.previewLabel}>Xem trước ảnh bìa chính:</p>
                        <img src={formData.image} alt="Cover Preview" className={styles.previewCover} onError={(e) => e.target.style.display="none"} />
                      </div>
                    )}
                  </div>

                  <div className={styles.tagManagerBox} style={{ marginTop: 24 }}>
                    <h4 className={styles.tagManagerTitle}>Bộ sưu tập Album ảnh (Photo Album)</h4>
                    <p className={styles.tagManagerSub}>Đường dẫn các bức ảnh chụp chi tiết, lộng lẫy về dịch vụ của bạn để hiển thị trong slide ảnh</p>
                    <div className={styles.tagInputRow}>
                      <input
                        type="text"
                        placeholder="Nhập URL ảnh album..."
                        className={styles.formInput}
                        value={tempAlbumUrl}
                        onChange={(e) => setTempAlbumUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAlbumPhoto())}
                      />
                      <button type="button" className={styles.tagAddBtn} onClick={addAlbumPhoto}>Thêm ảnh</button>
                    </div>
                    
                    <div className={styles.albumPreviewsGrid}>
                      {formData.album.map((photoUrl, idx) => (
                        <div key={idx} className={styles.albumPreviewCard}>
                          <img src={photoUrl} alt={`Album Preview ${idx + 1}`} className={styles.previewThumb} onError={(e) => e.target.src="/LOGO.svg"} />
                          <button type="button" className={styles.albumPhotoDeleteBtn} onClick={() => removeAlbumPhoto(idx)}>✕</button>
                        </div>
                      ))}
                      {formData.album.length === 0 && <p className={styles.emptyTagText}>Chưa có ảnh album nào được thêm.</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PRICING DETAILS PACKAGES */}
              {activeTab === "pricing" && (
                <div className={styles.tabPane}>
                  <div className={styles.pricingSectionHeader}>
                    <div>
                      <h4 className={styles.tagManagerTitle}>Thiết lập các gói báo giá chi tiết</h4>
                      <p className={styles.tagManagerSub}>Cô dâu chú rể có thể tích chọn từng gói này để cộng dồn giá trị thanh toán trực tiếp qua VNPay.</p>
                    </div>
                    <button type="button" className={styles.addPackageBtn} onClick={addPackage}>
                      + Thêm gói báo giá
                    </button>
                  </div>

                  <div className={styles.packagesFormList}>
                    {formData.pricingDetails.map((pkg, idx) => (
                      <div key={idx} className={styles.packageFormCard}>
                        <div className={styles.packageFormHeader}>
                          <span className={styles.packageFormIndex}>Gói số #{idx + 1}</span>
                          <button type="button" className={styles.packageDeleteBtn} onClick={() => removePackage(idx)}>
                            🗑️ Xoá gói này
                          </button>
                        </div>

                        <div className={styles.formGrid2Col}>
                          <div className={styles.formGroup}>
                            <label className={styles.requiredLabel}>Tên gói báo giá</label>
                            <input
                              type="text"
                              className={styles.formInput}
                              placeholder="Ví dụ: Gói Tiệc Vàng, Lavender Makeup Vip..."
                              value={pkg.name}
                              onChange={(e) => updatePackageField(idx, "name", e.target.value)}
                              required
                            />
                          </div>

                          <div className={styles.formGroup}>
                            <label className={styles.requiredLabel}>Đơn giá (VNĐ)</label>
                            <input
                              type="number"
                              className={styles.formInput}
                              placeholder="Ví dụ: 12000000"
                              value={pkg.price}
                              onChange={(e) => updatePackageField(idx, "price", e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: 12 }}>
                          <label>Quyền lợi đi kèm gói này</label>
                          <textarea
                            rows="2"
                            className={styles.formTextarea}
                            placeholder="Liệt kê những tiện ích, dịch vụ cụ thể nằm trong gói này..."
                            value={pkg.desc}
                            onChange={(e) => updatePackageField(idx, "desc", e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal footer controls */}
              <div className={styles.modalFooter}>
                <div className={styles.modalFooterNavigation}>
                  {activeTab !== "basic" && (
                    <button
                      type="button"
                      className={styles.navFormBtnPrev}
                      onClick={() => {
                        if (activeTab === "contact") setActiveTab("basic");
                        else if (activeTab === "services") setActiveTab("contact");
                        else if (activeTab === "images") setActiveTab("services");
                        else if (activeTab === "pricing") setActiveTab("images");
                      }}
                    >
                      ← Tab trước
                    </button>
                  )}
                  {activeTab !== "pricing" && (
                    <button
                      type="button"
                      className={styles.navFormBtnNext}
                      onClick={() => {
                        if (activeTab === "basic") setActiveTab("contact");
                        else if (activeTab === "contact") setActiveTab("services");
                        else if (activeTab === "services") setActiveTab("images");
                        else if (activeTab === "images") setActiveTab("pricing");
                      }}
                    >
                      Tab tiếp theo →
                    </button>
                  )}
                </div>

                <div className={styles.modalFooterActions}>
                  <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                    Huỷ
                  </button>
                  <button type="submit" className={styles.saveBtn}>
                    💾 Lưu Dịch Vụ
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer1 />
    </div>
  );
};

export default VendorDashboard;
