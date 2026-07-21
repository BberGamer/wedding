import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Footer1.module.css";

const Footer1 = ({ className = "" }) => {
  return (
    <footer className={[styles.footer, className].join(" ")}>
      <div className={styles.footerContainer}>
        {/* Left Side: Brand and Tagline */}
        <div className={styles.footerDetails}>
          <h2 className={styles.title}>
            AN Wedding
          </h2>
          <p className={styles.tagline}>
            Nơi kết nối các dịch vụ cưới hàng đầu Việt Nam, đồng hành cùng bạn kiến tạo ngày hạnh phúc trọn vẹn.
          </p>
          <div className={styles.socialIcons}>
            <a href="https://www.facebook.com/anwedding26" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@anwedding26" target="_blank" rel="noopener noreferrer" className={styles.socialIcon} aria-label="TikTok">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .8.11v-3.5a6.93 6.93 0 0 0-1.9-.26 6.34 6.34 0 0 0-6.38 6.38 6.27 6.27 0 0 0 6.27 6.26 6.35 6.35 0 0 0 6.26-6.27V8.16A8.29 8.29 0 0 0 20 9.87V6.69z"/>
              </svg>
            </a>
          </div>
          <div className={styles.legalLinks}>
            <Link to="/terms" className={styles.termsOfUse}>Điều khoản sử dụng</Link>
            <Link to="/privacy" className={styles.privacyPolicy}>Chính sách bảo mật</Link>
          </div>
        </div>

        {/* Right Side: Navigation and Newsletter */}
        <div className={styles.footerLinks}>
          <div className={styles.sitemap}>
            <h3 className={styles.sitemap2}>Sitemap</h3>
            <div className={styles.siteMapLinks}>
              <Link to="/" className={styles.home}>Trang chủ</Link>
              <Link to="/nha_hang" className={styles.home}>Nhà hàng</Link>
              <Link to="/category/trang_diem" className={styles.home}>Trang điểm</Link>
              <Link to="/category/xe_hoa" className={styles.home}>Xe hoa ngày cưới</Link>
              <Link to="/category/chup_anh" className={styles.home}>Chụp ảnh cưới</Link>
              <Link to="/category/vay_cuoi" className={styles.home}>Thuê váy & vest</Link>
            </div>
          </div>

          <div className={styles.sitemap}>
            <h3 className={styles.sitemap2}>Newsletter</h3>
            <div className={styles.subscription}>
              <p className={styles.enterYouEmail}>
                Đăng ký nhận bản tin cập nhật và ưu đãi mới nhất từ chúng tôi.
              </p>
              <form className={styles.subscriptionForm} onSubmit={(e) => e.preventDefault()}>
                <input
                  className={styles.frameChild}
                  placeholder="Nhập email của bạn..."
                  type="email"
                  required
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Copyright Info */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright2020}>
          &copy; 2026 AN Wedding. Bản quyền thuộc về Dotcreativemarket.
        </div>
      </div>
    </footer>
  );
};

Footer1.propTypes = {
  className: PropTypes.string,
};

export default Footer1;

