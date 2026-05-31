import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./VendorProfilePage.module.css";
import { API_URL } from "../config";

const categoryLabels = {
  nha_hang: "Nhà hàng tiệc cưới",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa ngày cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế"
};

const categoryColors = {
  nha_hang: "#4d5637",
  trang_diem: "#c3937c",
  xe_hoa: "#9d7236",
  chup_anh: "#5b7a9d",
  vay_cuoi: "#9d5b8c"
};

const VendorProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState(null);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchVendorProfile = async () => {
      // Guard: invalid or missing id
      if (!id || id === "undefined" || id === "null") {
        setError("Không tìm thấy thông tin nhà cung cấp (ID không hợp lệ). Vui lòng restart backend server và thử lại.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/vendors/${id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Không thể tải thông tin vendor");
        }
        const data = await res.json();
        setVendor(data.vendor);
        setServices(data.services);
        setStats(data.stats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProfile();
  }, [id]);


  const formatPrice = (val) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(val);

  const filteredServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const uniqueCategories = ["all", ...new Set(services.map((s) => s.category))];

  const getInitials = (name) =>
    name
      ?.split(" ")
      .slice(-2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "V";

  if (loading) {
    return (
      <div className={styles.fullPageLoader}>
        <div className={styles.loaderRing}></div>
        <p>Đang tải hồ sơ nhà cung cấp...</p>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className={styles.fullPageLoader}>
        <div className={styles.errorIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b85c5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <p className={styles.errorMsg}>{error || "Không tìm thấy nhà cung cấp"}</p>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Quay lại</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <SharedHeader />

      {/* Hero / Cover */}
      <div className={styles.hero}>
        <div className={styles.heroGradient} />
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          {/* Avatar */}
          <div className={styles.avatarWrapper}>
            {vendor.avatar ? (
              <img src={vendor.avatar} alt={vendor.name} className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarFallback}>{getInitials(vendor.name)}</div>
            )}
            <div className={styles.verifiedBadge} title="Nhà cung cấp được xác thực">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>

          {/* Identity */}
          <div className={styles.heroText}>
            <div className={styles.heroEyebrow}>NHÀ CUNG CẤP DỊCH VỤ CƯỚI</div>
            <h1 className={styles.heroName}>{vendor.name}</h1>
            {vendor.description && (
              <p className={styles.heroDesc}>{vendor.description}</p>
            )}

            {/* Social + Contact */}
            <div className={styles.heroLinks}>
              {vendor.phone && (
                <a href={`tel:${vendor.phone}`} className={styles.heroLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {vendor.phone}
                </a>
              )}
              {vendor.email && (
                <a href={`mailto:${vendor.email}`} className={styles.heroLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                  {vendor.email}
                </a>
              )}
              {vendor.facebook && (
                <a href={vendor.facebook} target="_blank" rel="noreferrer" className={styles.heroLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                  Facebook
                </a>
              )}
              {vendor.instagram && (
                <a href={vendor.instagram} target="_blank" rel="noreferrer" className={styles.heroLink}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {stats && (
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.totalServices}</span>
              <span className={styles.statLabel}>Dịch vụ</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.avgRating}</span>
              <span className={styles.statLabel}>Điểm đánh giá</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{stats.totalReviews}</span>
              <span className={styles.statLabel}>Lượt đánh giá</span>
            </div>
            {vendor.address && (
              <>
                <div className={styles.statDivider} />
                <div className={styles.statItemWide}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6, flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className={styles.statLabel}>{vendor.address}</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Section: Services */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>DANH MỤC DỊCH VỤ</p>
                <h2 className={styles.sectionTitle}>Các Dịch Vụ Cưới</h2>
              </div>
              {/* Category Filter tabs */}
              <div className={styles.categoryTabs}>
                {uniqueCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat === "all" ? "Tất cả" : categoryLabels[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredServices.length === 0 ? (
              <div className={styles.emptyState}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c3937c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p>Nhà cung cấp này chưa có dịch vụ nào.</p>
              </div>
            ) : (
              <div className={styles.servicesGrid}>
                {filteredServices.map((service) => (
                  <Link to={`/service/${service._id}`} key={service._id} className={styles.serviceCard}>
                    <div className={styles.serviceImgWrap}>
                      <img
                        src={service.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=600"}
                        alt={service.name}
                        className={styles.serviceImg}
                      />
                      {service.badge && (
                        <span className={styles.serviceBadge}>{service.badge}</span>
                      )}
                      <div className={styles.serviceImgOverlay} />
                    </div>
                    <div className={styles.serviceBody}>
                      <span
                        className={styles.serviceCatTag}
                        style={{ color: categoryColors[service.category] || "#9d7236" }}
                      >
                        {categoryLabels[service.category] || service.category}
                      </span>
                      <h3 className={styles.serviceName}>{service.name}</h3>
                      {service.address && (
                        <div className={styles.serviceAddress}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                          </svg>
                          {service.address}
                        </div>
                      )}
                      <div className={styles.serviceFooter}>
                        <span className={styles.servicePrice}>
                          {service.priceLabel || formatPrice(service.price)}
                        </span>
                        <span className={styles.serviceRating}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#e2a93b" stroke="#e2a93b" strokeWidth="1">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          {service.rating || "5.0"} ({service.reviewsCount || 0})
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Section: About Vendor */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.sectionEyebrow}>GIỚI THIỆU</p>
                <h2 className={styles.sectionTitle}>Về Nhà Cung Cấp</h2>
              </div>
            </div>
            <div className={styles.aboutGrid}>
              <div className={styles.aboutCard}>
                <div className={styles.aboutCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h4 className={styles.aboutCardTitle}>Thông tin liên hệ</h4>
                  <div className={styles.aboutInfoList}>
                    {vendor.phone && (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Điện thoại</span>
                        <a href={`tel:${vendor.phone}`} className={styles.aboutVal}>{vendor.phone}</a>
                      </div>
                    )}
                    <div className={styles.aboutInfoRow}>
                      <span className={styles.aboutKey}>Email</span>
                      <a href={`mailto:${vendor.email}`} className={styles.aboutVal}>{vendor.email}</a>
                    </div>
                    {vendor.address && (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Địa chỉ</span>
                        <span className={styles.aboutVal}>{vendor.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.aboutCard}>
                <div className={styles.aboutCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div>
                  <h4 className={styles.aboutCardTitle}>Mạng xã hội</h4>
                  <div className={styles.aboutInfoList}>
                    {vendor.facebook ? (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Facebook</span>
                        <a href={vendor.facebook} target="_blank" rel="noreferrer" className={styles.aboutVal}>{vendor.facebook.replace("https://", "")}</a>
                      </div>
                    ) : (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Facebook</span>
                        <span className={styles.aboutValEmpty}>Chưa cập nhật</span>
                      </div>
                    )}
                    {vendor.instagram ? (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Instagram</span>
                        <a href={vendor.instagram} target="_blank" rel="noreferrer" className={styles.aboutVal}>{vendor.instagram.replace("https://", "")}</a>
                      </div>
                    ) : (
                      <div className={styles.aboutInfoRow}>
                        <span className={styles.aboutKey}>Instagram</span>
                        <span className={styles.aboutValEmpty}>Chưa cập nhật</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.aboutCard + " " + styles.aboutCardWide}>
                <div className={styles.aboutCardIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className={styles.aboutCardTitle}>Giới thiệu</h4>
                  <p className={styles.aboutDesc}>
                    {vendor.description || "Nhà cung cấp chưa cập nhật thông tin giới thiệu."}
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default VendorProfilePage;
