import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./SharedHeader.module.css";

const roleLabel = { admin: "Quản trị viên", vendor: "Nhà cung cấp", customer: "Khách hàng" };

const SharedHeader = ({ className = "", theme = "light" }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
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
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                      <span className={styles.roleBadge}>{roleLabel[user.role] || user.role}</span>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link to="/profile" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                      Trang cá nhân
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
                <div className={styles.dropdown} style={{ width: 220, top: "calc(100% + 2px)" }}>
                  <Link to="/nha_hang" className={styles.dropdownItem} onClick={() => setServicesOpen(false)}>
                    Nhà hàng tiệc cưới
                  </Link>
                  <Link to="/category/trang_diem" className={styles.dropdownItem} onClick={() => setServicesOpen(false)}>
                    Trang điểm cô dâu
                  </Link>
                  <Link to="/category/xe_hoa" className={styles.dropdownItem} onClick={() => setServicesOpen(false)}>
                    Xe hoa ngày cưới
                  </Link>
                  <Link to="/category/chup_anh" className={styles.dropdownItem} onClick={() => setServicesOpen(false)}>
                    Chụp ảnh, phóng sự
                  </Link>
                  <Link to="/category/vay_cuoi" className={styles.dropdownItem} onClick={() => setServicesOpen(false)}>
                    Thuê váy & vest cưới
                  </Link>
                </div>
              )}
            </div>
            <Link to="/about" className={styles.navItem}>
              <span className={[styles.navText, isDark ? styles.navTextDark : ""].join(" ")}>About Us</span>
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
        <Link to="/nha_hang" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Nhà hàng tiệc cưới</Link>
        <Link to="/category/trang_diem" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Trang điểm cô dâu</Link>
        <Link to="/category/xe_hoa" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Xe hoa ngày cưới</Link>
        <Link to="/category/chup_anh" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Chụp ảnh cưới</Link>
        <Link to="/category/vay_cuoi" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>Thuê váy & vest cưới</Link>
        <Link to="/about" className={styles.mobileNavItem} onClick={() => setMenuOpen(false)}>About Us</Link>
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
