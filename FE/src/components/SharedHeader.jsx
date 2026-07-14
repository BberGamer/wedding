import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import { API_URL } from "../config";
import styles from "./SharedHeader.module.css";

const roleLabel = { admin: "Quản trị viên", vendor: "Nhà cung cấp", customer: "Khách hàng" };

const SharedHeader = ({ className = "", theme = "light" }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Fetch featured services for Mega Menu
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_URL}/api/services`);
        if (res.ok) {
          const data = await res.json();
          // Take 3 services
          setFeaturedServices(data.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch featured services for mega menu", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock scroll body when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate("/");
  };

  const handleBookClick = () => {
    setMenuOpen(false);
    if (user) navigate("/partner");
    else navigate("/login");
  };

  const isDark = theme === "dark";

  return (
    <>
      <header className={[styles.header, isDark ? styles.headerDark : styles.headerLight, className].join(" ")}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link to="/" className={styles.logoArea}>
            <img className={styles.logoIcon} loading="lazy" alt="AN Wedding" src="/LOGO.svg" />
            <span className={styles.brandName}>AN<br />WEDDING</span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.nav}>
            <div 
              className={styles.accountMenu} 
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <div className={styles.navItem} style={{ cursor: "pointer" }}>
                <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>
                  Dịch vụ cưới <span style={{ fontSize: 9 }}>▼</span>
                </span>
              </div>
              {servicesOpen && (
                <div className={styles.megaMenuContainer}>
                  <div className={styles.megaMenuInner}>
                    {/* Left Column: Service Categories */}
                    <div className={styles.megaMenuCol}>
                      <span className={styles.megaColTitle}>Danh mục dịch vụ</span>
                      <div className={styles.megaCategoriesList}>
                        <Link to="/nha_hang" className={styles.megaCategoryCard} onClick={() => setServicesOpen(false)}>
                          <div className={styles.megaCategoryIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <rect x="3" y="3" width="18" height="18" rx="2"/>
                              <line x1="9" y1="3" x2="9" y2="21"/>
                              <line x1="15" y1="3" x2="15" y2="21"/>
                              <line x1="3" y1="9" x2="21" y2="9"/>
                              <line x1="3" y1="15" x2="21" y2="15"/>
                            </svg>
                          </div>
                          <div className={styles.megaCategoryInfo}>
                            <h4>Nhà hàng tiệc cưới</h4>
                            <p>Không gian tổ chức tiệc cưới sang trọng</p>
                          </div>
                          <span className={styles.megaArrow}>→</span>
                        </Link>

                        <Link to="/category/trang_diem" className={styles.megaCategoryCard} onClick={() => setServicesOpen(false)}>
                          <div className={styles.megaCategoryIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <path d="m18 8-1 1-6-6 1-1a3 3 0 1 1 6 6Z"/>
                              <path d="M12 12c.5-2.5 2.5-4.5 5-5"/>
                              <path d="m11 11-7.3 7.3a2 2 0 1 0 2.8 2.8L14 14"/>
                            </svg>
                          </div>
                          <div className={styles.megaCategoryInfo}>
                            <h4>Trang điểm cô dâu</h4>
                            <p>Chuyên gia makeup và làm tóc</p>
                          </div>
                          <span className={styles.megaArrow}>→</span>
                        </Link>

                        <Link to="/category/chup_anh" className={styles.megaCategoryCard} onClick={() => setServicesOpen(false)}>
                          <div className={styles.megaCategoryIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                              <circle cx="12" cy="13" r="3"/>
                            </svg>
                          </div>
                          <div className={styles.megaCategoryInfo}>
                            <h4>Chụp ảnh cưới</h4>
                            <p>Studio, ngoại cảnh, phóng sự</p>
                          </div>
                          <span className={styles.megaArrow}>→</span>
                        </Link>

                        <Link to="/category/xe_hoa" className={styles.megaCategoryCard} onClick={() => setServicesOpen(false)}>
                          <div className={styles.megaCategoryIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <rect x="1" y="11" width="22" height="8" rx="2"/>
                              <path d="M4 11V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/>
                              <circle cx="6" cy="15" r="1.5"/>
                              <circle cx="18" cy="15" r="1.5"/>
                            </svg>
                          </div>
                          <div className={styles.megaCategoryInfo}>
                            <h4>Xe hoa ngày cưới</h4>
                            <p>Xe sang, xe cổ, limousine</p>
                          </div>
                          <span className={styles.megaArrow}>→</span>
                        </Link>

                        <Link to="/category/vay_cuoi" className={styles.megaCategoryCard} onClick={() => setServicesOpen(false)}>
                          <div className={styles.megaCategoryIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                              <path d="M6 3h12l2 6-4 12H8L4 9l2-6z"/>
                              <path d="M10 3v6"/>
                              <path d="M14 3v6"/>
                              <path d="M6 9h12"/>
                            </svg>
                          </div>
                          <div className={styles.megaCategoryInfo}>
                            <h4>Thuê váy & vest cưới</h4>
                            <p>Váy cưới và veston cao cấp</p>
                          </div>
                          <span className={styles.megaArrow}>→</span>
                        </Link>
                      </div>
                    </div>

                    {/* Center Column: Featured Services */}
                    <div className={`${styles.megaMenuCol} ${styles.featuredCol}`}>
                      <span className={styles.megaColTitle}>✨ Dịch vụ nổi bật</span>
                      <div className={styles.featuredList}>
                        {featuredServices.length > 0 ? (
                          featuredServices.map((svc) => (
                            <Link 
                              key={svc._id} 
                              to={`/service/${svc._id}`} 
                              className={styles.featuredCard}
                              onClick={() => setServicesOpen(false)}
                            >
                              <img src={svc.image} alt={svc.name} className={styles.featuredThumb} />
                              <div className={styles.featuredCardInfo}>
                                <h5>{svc.name}</h5>
                                <div className={styles.featuredRating}>⭐️ {svc.rating || 5.0}</div>
                                <p>{svc.priceLabel || "Giá tốt nhất"}</p>
                              </div>
                            </Link>
                          ))
                        ) : (
                          <div className={styles.featuredPlaceholder}>Đang tải danh sách dịch vụ...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link to="/about" className={styles.navItem}>
              <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>About Us</span>
            </Link>
            <Link to="/blog" className={styles.navItem}>
              <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>Blog</span>
            </Link>
            <Link to="/compare" className={styles.navItem}>
              <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>So sánh</span>
            </Link>
            {user && user.role === "admin" ? (
              <Link to="/admin/dashboard" className={styles.navItem}>
                <span className={[styles.navText, isDark ? styles.navTextDark : "", styles.vendorNavHighlight].join(" ")}>Dashboard Admin</span>
              </Link>
            ) : user && user.role === "vendor" ? (
              <Link to="/vendor/dashboard" className={styles.navItem}>
                <span className={[styles.navText, isDark ? styles.navTextDark : "", styles.vendorNavHighlight].join(" ")}>Quản lý dịch vụ</span>
              </Link>
            ) : (
              <Link to="/" className={[styles.navItem, styles.navItemHide].join(" ")}>
                <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>Trở thành nhà cung cấp</span>
              </Link>
            )}
            <div className={styles.navItem}>
              <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>contact: 0337774204</span>
            </div>

            <button className={styles.bookBtn} onClick={handleBookClick}>
              <div className={styles.bookBtnBg} />
              <span className={styles.bookBtnText}>Book</span>
            </button>

            {user ? (
              <div className={styles.accountMenu} ref={dropdownRef}>
                <div
                  className={styles.navItem}
                  onClick={() => setDropdownOpen((v) => !v)}
                  style={{ cursor: "pointer" }}
                >
                  <span className={styles.avatarDot}>
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                  <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>
                    {user.name?.split(" ").pop()}
                  </span>
                </div>
                {dropdownOpen && (
                  <div className={[styles.dropdown, styles.dropdownRight].join(" ")}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                      <span className={styles.roleBadge}>{roleLabel[user.role] || user.role}</span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Trang cá nhân
                    </Link>
                    <Link to="/my-projects" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Dự án của tôi
                    </Link>
                    {(user.role === "vendor" || user.role === "admin") && (
                      <Link to="/vendor/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        Quản lý dịch vụ
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link to="/admin/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                        Dashboard Admin
                      </Link>
                    )}
                    <div className={styles.dropdownItem} onClick={handleLogout}>
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className={styles.navItem}>
                <span className={[styles.navText, styles.loginText, isDark ? styles.navTextDark : ""].join(" ")}>
                  Đăng Nhập
                </span>
              </Link>
            )}
          </nav>

          {/* Hamburger (mobile only) */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={[styles.mobileOverlay, menuOpen ? styles.mobileOverlayOpen : ""].join(" ")}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer */}
      <nav className={[styles.mobileNav, menuOpen ? styles.mobileNavOpen : ""].join(" ")}>
        <button className={styles.mobileNavClose} onClick={() => setMenuOpen(false)}>✕</button>

        {user ? (
          <>
            <div style={{ marginBottom: 8 }}>
              <p style={{ margin: "0 0 2px", fontFamily: "Cormorant,serif", fontSize: 18, color: "#4d5637", fontWeight: 600 }}>{user.name}</p>
              <p style={{ margin: 0, fontFamily: "Raleway,sans-serif", fontSize: 12, color: "#787878" }}>{user.email}</p>
            </div>
            <Link to="/profile" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Trang cá nhân</Link>
            {user.role === "admin" && (
              <Link to="/admin/dashboard" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Dashboard Admin</Link>
            )}
            {(user.role === "vendor" || user.role === "admin") && (
              <Link to="/vendor/dashboard" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Quản lý dịch vụ</Link>
            )}
          </>
        ) : (
          <Link to="/login" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Đăng Nhập</Link>
        )}

        <Link to="/" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Trang chủ</Link>
        <div className={styles.mobileAccordion}>
          <button 
            type="button"
            className={styles.mobileAccordionToggle} 
            onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
          >
            Dịch vụ cưới <span>{mobileServicesOpen ? "▲" : "▼"}</span>
          </button>
          <div className={`${styles.mobileAccordionContent} ${mobileServicesOpen ? styles.mobileAccordionOpen : ""}`}>
            <Link to="/nha_hang" className={styles.mobileAccordionItem} onClick={() => setMenuOpen(false)}>
              🏛 Nhà hàng tiệc cưới
            </Link>
            <Link to="/category/trang_diem" className={styles.mobileAccordionItem} onClick={() => setMenuOpen(false)}>
              💄 Trang điểm cô dâu
            </Link>
            <Link to="/category/chup_anh" className={styles.mobileAccordionItem} onClick={() => setMenuOpen(false)}>
              📸 Chụp ảnh cưới
            </Link>
            <Link to="/category/xe_hoa" className={styles.mobileAccordionItem} onClick={() => setMenuOpen(false)}>
              🚗 Xe hoa cưới
            </Link>
            <Link to="/category/vay_cuoi" className={styles.mobileAccordionItem} onClick={() => setMenuOpen(false)}>
              👗 Váy cưới cao cấp
            </Link>
          </div>
        </div>
        <Link to="/about" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>About Us</Link>
        <Link to="/blog" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link to="/compare" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>So sánh dịch vụ</Link>
        <Link to="/partner" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Wedding Planner</Link>
        <div className={styles.mobileNavItem} style={{ padding: "12px 0", color: "#555" }}>contact: 0337774204</div>

        {user && (
          <div className={styles.mobileNavItem} style={{ color: "#b85c5c", cursor: "pointer" }} onClick={handleLogout}>
            Đăng xuất
          </div>
        )}

        <button className={styles.mobileBookBtn} onClick={handleBookClick}>Book ngay</button>
      </nav>
    </>
  );
};

SharedHeader.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(["light", "dark"]),
};

export default SharedHeader;
