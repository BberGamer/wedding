import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ProfilePage.module.css";
import { API_URL } from "../config";

const roleLabel = { admin: "Quản trị viên", vendor: "Nhà cung cấp", customer: "Khách hàng" };
const roleColor = { admin: "#9d7236", vendor: "#4d5637", customer: "#c3937c" };

const categoryLabels = {
  nha_hang: "Nhà hàng",
  trang_diem: "Trang điểm cô dâu",
  xe_hoa: "Xe hoa cưới",
  chup_anh: "Chụp ảnh cưới",
  vay_cuoi: "Váy cưới thiết kế"
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    description: "",
    facebook: "",
    instagram: "",
    avatar: "",
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Orders history state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favoriteServices, setFavoriteServices] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(stored);
    setUser(parsed);
    setFormData({
      name: parsed.name || "",
      email: parsed.email || "",
      password: "",
      phone: parsed.phone || "",
      address: parsed.address || "",
      description: parsed.description || "",
      facebook: parsed.facebook || "",
      instagram: parsed.instagram || "",
      avatar: parsed.avatar || "",
    });

    const savedFavs = localStorage.getItem("wedding_favorites");
    if (savedFavs) {
      try {
        setFavoritesCount(JSON.parse(savedFavs).length);
      } catch (e) {
        console.error(e);
      }
    }
  }, [navigate]);

  // Fetch orders from API
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return;

    setOrdersLoading(true);
    fetch(`${API_URL}/api/payments/user`, {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error("Fetch orders error: ", err);
        setOrdersLoading(false);
      });
  }, [user]);

  // Fetch reviews count from API
  useEffect(() => {
    if (!user) return;
    fetch(`${API_URL}/api/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not fetch reviews");
        return res.json();
      })
      .then((data) => {
        const userReviews = data.filter(
          (r) => r.author === user.name || r.author === user.email
        );
        setReviewsCount(userReviews.length);
      })
      .catch((err) => {
        console.error("Fetch reviews count error: ", err);
      });
  }, [user]);

  // Fetch favorite services from API
  useEffect(() => {
    const savedFavs = localStorage.getItem("wedding_favorites");
    if (!savedFavs) return;
    try {
      const favIds = JSON.parse(savedFavs);
      if (favIds.length === 0) {
        setFavoriteServices([]);
        return;
      }
      setFavoritesLoading(true);
      fetch(`${API_URL}/api/services`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not fetch services");
          return res.json();
        })
        .then((data) => {
          const filtered = data.filter((s) => favIds.includes(s._id));
          setFavoriteServices(filtered);
          setFavoritesLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setFavoritesLoading(false);
        });
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  const handleRemoveFavorite = (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    const savedFavs = localStorage.getItem("wedding_favorites");
    if (!savedFavs) return;
    try {
      const favIds = JSON.parse(savedFavs);
      const updated = favIds.filter((favId) => favId !== id);
      localStorage.setItem("wedding_favorites", JSON.stringify(updated));
      setFavoritesCount(updated.length);
      setFavoriteServices(favoriteServices.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password || undefined,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
          facebook: formData.facebook,
          instagram: formData.instagram,
          avatar: formData.avatar,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        setSuccessMsg("Cập nhật thành công!");
        setFormData(prev => ({ ...prev, password: "" }));
        setEditMode(false);
      } else {
        setSuccessMsg(data.message || "Cập nhật thất bại");
      }
    } catch {
      setSuccessMsg("Không thể kết nối đến server. Đã lưu thông tin cục bộ.");
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        description: formData.description,
        facebook: formData.facebook,
        instagram: formData.instagram,
        avatar: formData.avatar,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  if (!user) return null;

  const joinDate = new Date().toLocaleDateString("vi-VN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className={styles.profilePage}>
      {/* Decorative */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <img className={styles.bgLeaf} alt="" src="/Layer-1.svg" />
      <img className={styles.bgLeaf2} alt="" src="/Path-Stroke.svg" />

      {/* Top nav strip */}
      <nav className={styles.topNav}>
        <Link to="/" className={styles.navLogo}>
          <img src="/LOGO.svg" alt="AN Wedding" className={styles.logoImg} />
          <span className={styles.navBrand}>AN WEDDING</span>
        </Link>
        <div className={styles.navLinks}>
          <Link to="/" className={styles.navLink}>Trang chủ</Link>
          <Link to="/partner" className={styles.navLink}>Wedding Planner</Link>
          <Link to="/nha_hang" className={styles.navLink}>Nhà hàng</Link>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className={styles.pageContent}>
        {/* Hero card */}
        <div className={styles.heroCard}>
          <div className={styles.heroBgPattern} />

          {user.role === "admin" && (
            <div className={styles.vendorHeroCta} style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link to="/admin/dashboard" className={styles.vendorCtaBtn} style={{ background: "linear-gradient(135deg, #c3937c 0%, #9d7236 100%)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Dashboard Admin →
              </Link>
              <Link to="/vendor/dashboard" className={styles.vendorCtaBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Quản lý dịch vụ cưới →
              </Link>
            </div>
          )}
          {user.role === "vendor" && (
            <div className={styles.vendorHeroCta}>
              <Link to="/vendor/dashboard" className={styles.vendorCtaBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                Quản lý dịch vụ cưới →
              </Link>
            </div>
          )}

          <div className={styles.avatarSection}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className={styles.avatarImage} />
            ) : (
              <div className={styles.avatarLarge}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className={styles.avatarInfo}>
              <h1 className={styles.userName}>{user.name}</h1>
              <span
                className={styles.userRole}
                style={{ backgroundColor: roleColor[user.role] + "22", color: roleColor[user.role] }}
              >
                {roleLabel[user.role] || user.role}
              </span>
            </div>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <span className={styles.statNum}>{orders.length}</span>
              <span className={styles.statLabel}>Đơn đặt</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNum}>{reviewsCount}</span>
              <span className={styles.statLabel}>Đánh giá</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statBox}>
              <span className={styles.statNum}>{favoritesCount}</span>
              <span className={styles.statLabel}>Yêu thích</span>
            </div>
          </div>
        </div>

        {/* Info section grid */}
        <div className={styles.infoGrid}>
          {/* Left: account info card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Thông tin tài khoản</h2>
              {!editMode && (
                <button className={styles.editBtn} onClick={() => setEditMode(true)}>
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className={styles.cardDivider} />

            {editMode ? (
              <form className={styles.editForm} onSubmit={handleSave}>
                <div className={styles.editFormGrid}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Email đăng nhập (Cố định)</label>
                    <input
                      className={styles.fieldInput}
                      type="email"
                      value={formData.email}
                      disabled
                      style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#f5ede5' }}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Họ và tên</label>
                    <input
                      id="profile-name"
                      className={styles.fieldInput}
                      type="text"
                      name="name"
                      placeholder="Nguyễn Văn A"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Số điện thoại</label>
                    <input
                      id="profile-phone"
                      className={styles.fieldInput}
                      type="tel"
                      name="phone"
                      placeholder="0912345678"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Địa chỉ</label>
                    <input
                      id="profile-address"
                      className={styles.fieldInput}
                      type="text"
                      name="address"
                      placeholder="Hà Nội, Việt Nam"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Mật khẩu mới (Bỏ trống nếu giữ nguyên)</label>
                    <input
                      id="profile-password"
                      className={styles.fieldInput}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Ảnh đại diện (URL)</label>
                    <input
                      id="profile-avatar"
                      className={styles.fieldInput}
                      type="text"
                      name="avatar"
                      placeholder="https://example.com/avatar.jpg"
                      value={formData.avatar}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Link Facebook</label>
                    <input
                      id="profile-facebook"
                      className={styles.fieldInput}
                      type="text"
                      name="facebook"
                      placeholder="https://facebook.com/username"
                      value={formData.facebook}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formField}>
                    <label className={styles.fieldLabel}>Link Instagram</label>
                    <input
                      id="profile-instagram"
                      className={styles.fieldInput}
                      type="text"
                      name="instagram"
                      placeholder="https://instagram.com/username"
                      value={formData.instagram}
                      onChange={handleChange}
                    />
                  </div>

                  <div className={styles.formFieldFull}>
                    <label className={styles.fieldLabel}>Mô tả bản thân</label>
                    <textarea
                      id="profile-description"
                      className={styles.fieldInput}
                      name="description"
                      placeholder="Hãy giới thiệu một chút về bản thân..."
                      value={formData.description}
                      onChange={handleChange}
                      rows="3"
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                </div>

                <div className={styles.editActions}>
                  <button type="submit" className={styles.saveBtn} disabled={saving}>
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        name: user.name || "",
                        email: user.email || "",
                        password: "",
                        phone: user.phone || "",
                        address: user.address || "",
                        description: user.description || "",
                        facebook: user.facebook || "",
                        instagram: user.instagram || "",
                        avatar: user.avatar || "",
                      });
                    }}
                  >
                    Huỷ
                  </button>
                </div>
                {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
              </form>
            ) : (
              <div className={styles.infoList}>
                {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Họ và tên</span>
                  <span className={styles.infoVal}>{user.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Email</span>
                  <span className={styles.infoVal}>{user.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Số điện thoại</span>
                  <span className={styles.infoVal}>{user.phone || "Chưa cập nhật"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Địa chỉ</span>
                  <span className={styles.infoVal}>{user.address || "Chưa cập nhật"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Mô tả</span>
                  <span className={styles.infoVal}>{user.description || "Chưa cập nhật"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Facebook</span>
                  <span className={styles.infoVal}>
                    {user.facebook ? (
                      <a href={user.facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#c3937c', textDecoration: 'none', fontWeight: 600 }}>
                        Link Facebook
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Instagram</span>
                  <span className={styles.infoVal}>
                    {user.instagram ? (
                      <a href={user.instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#c3937c', textDecoration: 'none', fontWeight: 600 }}>
                        Link Instagram
                      </a>
                    ) : (
                      "Chưa cập nhật"
                    )}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Vai trò</span>
                  <span className={styles.infoVal}>{roleLabel[user.role] || user.role}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoKey}>Ngày tham gia</span>
                  <span className={styles.infoVal}>{joinDate}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: quick actions card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Khám phá nhanh</h2>
            </div>
            <div className={styles.cardDivider} />
            <div className={styles.quickLinks}>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className={[styles.quickLink, styles.quickLinkVendorHighlight].join(" ")} style={{ marginBottom: 12 }}>
                  <div className={styles.quickIcon} style={{ background: "linear-gradient(135deg, #c3937c 0%, #9d7236 100%)", color: "#fff" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <p className={styles.quickTitle} style={{ color: "#9d7236", fontWeight: 700 }}>Dashboard Thống Kê Admin</p>
                    <p className={styles.quickSub}>Xem doanh thu, tổng số đơn book, người dùng & dịch vụ</p>
                  </div>
                </Link>
              )}
              {(user.role === "vendor" || user.role === "admin") && (
                <Link to="/vendor/dashboard" className={[styles.quickLink, styles.quickLinkVendorHighlight].join(" ")}>
                  <div className={styles.quickIcon} style={{ background: "#4d5637", color: "#fff" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
                  </div>
                  <div>
                    <p className={styles.quickTitle} style={{ color: "#4d5637", fontWeight: 700 }}>Quản lý dịch vụ của bạn</p>
                    <p className={styles.quickSub}>Đăng bài, chỉnh sửa dịch vụ cưới & báo giá</p>
                  </div>
                </Link>
              )}
              <Link to="/nha_hang" className={styles.quickLink}>
                <div className={styles.quickIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <div>
                  <p className={styles.quickTitle}>Danh sách nhà hàng</p>
                  <p className={styles.quickSub}>Tìm địa điểm hoàn hảo cho ngày cưới</p>
                </div>
              </Link>
              <Link to="/partner" className={styles.quickLink}>
                <div className={styles.quickIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div>
                  <p className={styles.quickTitle}>Wedding Planner</p>
                  <p className={styles.quickSub}>Lên kế hoạch lễ cưới cùng chuyên gia</p>
                </div>
              </Link>
              <Link to="/" className={styles.quickLink}>
                <div className={styles.quickIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                </div>
                <div>
                  <p className={styles.quickTitle}>Trang chủ</p>
                  <p className={styles.quickSub}>Khám phá các dịch vụ cưới hỏi</p>
                </div>
              </Link>
            </div>

            <div className={styles.cardDivider} style={{ marginTop: "auto" }} />
            <button className={styles.dangerBtn} onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Đăng xuất khỏi tài khoản
            </button>
          </div>
        </div>

        {/* Bottom Grid for History & Favorites */}
        <div className={styles.bottomGrid}>
          {/* Lịch sử đặt dịch vụ section */}
          <div className={styles.card} style={{ flex: 1.2 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Lịch sử đặt dịch vụ tiệc cưới</h2>
              <span className={styles.badgeCount}>{orders.length} giao dịch</span>
            </div>
            <div className={styles.cardDivider} />

            {ordersLoading ? (
              <div className={styles.historyLoading}>
                <div className={styles.spinner}></div>
                <p>Đang tải lịch sử giao dịch thanh toán...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className={styles.historyEmpty}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c3937c', marginBottom: '16px' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <h3>Chưa có dịch vụ nào được đặt</h3>
                <p>Khám phá bộ sưu tập dịch vụ cưới của chúng tôi và đặt lịch qua cổng VNPay để hiện thực hóa đám cưới trong mơ của bạn.</p>
                <div className={styles.emptyActions}>
                  <Link to="/nha_hang" className={styles.exploreBtn}>Đặt nhà hàng cưới</Link>
                  <Link to="/category/trang_diem" className={styles.exploreBtn}>Đặt trang điểm cô dâu</Link>
                </div>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => {
                  const orderDate = new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit"
                  });
                  return (
                    <div key={order._id} className={styles.orderItem}>
                      <div className={styles.orderHeaderRow}>
                        <div className={styles.serviceMeta}>
                          <span className={styles.serviceCategoryBadge}>
                            {categoryLabels[order.service?.category] || "Dịch vụ cưới"}
                          </span>
                          <h3 className={styles.serviceNameLink}>
                            {order.service ? (
                              <Link to={`/service/${order.service._id}`}>{order.service.name}</Link>
                            ) : (
                              "Dịch vụ đã gỡ bỏ"
                            )}
                          </h3>
                        </div>
                        <div className={styles.paymentStatusBlock}>
                          <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                            {order.status === "completed" && "✓ THÀNH CÔNG"}
                            {order.status === "pending" && "⏳ ĐANG CHỜ PHÊ DUYỆT"}
                            {order.status === "failed" && "✕ THẤT BẠI"}
                          </span>
                        </div>
                      </div>

                      <div className={styles.orderBodyRow}>
                        <div className={styles.packageListInfo}>
                          <span className={styles.infoLabel}>CÁC GÓI DỊCH VỤ ĐÃ ĐĂNG KÝ:</span>
                          <div className={styles.pkgsGrid}>
                            {order.items.map((it, idx) => (
                              <div key={idx} className={styles.pkgTagItem}>
                                <span className={styles.pkgTagName}>{it.name}</span>
                                <span className={styles.pkgTagPrice}>{formatPrice(it.price)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={styles.orderFooterRow}>
                        <div className={styles.footerMeta}>
                          <div>
                            <span className={styles.footerLabel}>MÃ GIAO DỊCH VNPAY:</span>
                            <span className={styles.txnRefVal}>{order.txnRef}</span>
                          </div>
                          <div>
                            <span className={styles.footerLabel}>THỜI GIAN ĐẶT:</span>
                            <span className={styles.dateVal}>{orderDate}</span>
                          </div>
                        </div>
                        <div className={styles.footerPriceBlock}>
                          <span className={styles.footerPriceLabel}>TỔNG TIỀN THANH TOÁN</span>
                          <span className={styles.footerPriceVal}>{formatPrice(order.amount)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dịch vụ yêu thích section */}
          <div className={styles.card} style={{ flex: 0.8 }}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Dịch vụ đã lưu yêu thích</h2>
              <span className={styles.badgeCount}>{favoriteServices.length} đã lưu</span>
            </div>
            <div className={styles.cardDivider} />

            {favoritesLoading ? (
              <div className={styles.historyLoading}>
                <div className={styles.spinner}></div>
                <p>Đang tải danh sách yêu thích...</p>
              </div>
            ) : favoriteServices.length === 0 ? (
              <div className={styles.historyEmpty}>
                <div className={styles.emptyIcon}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#c3937c', marginBottom: '16px' }}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <h3>Chưa có dịch vụ yêu thích nào</h3>
                <p>Khi duyệt qua các dịch vụ cưới, nhấn vào nút Trái tim yêu thích để lưu lại và xem nhanh tại đây.</p>
                <div className={styles.emptyActions}>
                  <Link to="/nha_hang" className={styles.exploreBtn}>Tìm nhà hàng</Link>
                  <Link to="/partner" className={styles.exploreBtn}>Tìm Planner</Link>
                </div>
              </div>
            ) : (
              <div className={styles.favoritesList}>
                {favoriteServices.map((fav) => (
                  <div key={fav._id} className={styles.favoriteItem}>
                    <img src={fav.image || "/placeholder.png"} alt={fav.name} className={styles.favoriteImg} />
                    <div className={styles.favoriteInfo}>
                      <span className={styles.favoriteCategory}>
                        {categoryLabels[fav.category] || "Dịch vụ cưới"}
                      </span>
                      <h4 className={styles.favoriteName}>
                        <Link to={`/service/${fav._id}`}>{fav.name}</Link>
                      </h4>
                      {fav.pricingDetails && fav.pricingDetails.length > 0 && (
                        <p className={styles.favoritePrice}>
                          Từ {formatPrice(Math.min(...fav.pricingDetails.map(p => p.price)))}
                        </p>
                      )}
                    </div>
                    <button
                      className={styles.unfavoriteBtn}
                      onClick={(e) => handleRemoveFavorite(fav._id, e)}
                      title="Xóa khỏi yêu thích"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
