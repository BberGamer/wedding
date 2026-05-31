import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Footer1.module.css";

const Footer1 = ({ className = "" }) => {
  return (
    <footer className={[styles.footer, className].join(" ")}>
      <div className={styles.footerDetails}>
        <h1 className={styles.title}>
          Our wedding planners will leave you breathless on your special day.
        </h1>
        <div className={styles.footerDetailsInner}>
          <div className={styles.copyright2020LaaParent}>
            <div className={styles.copyright2020}>
              Copyright Dotcreativemarket
            </div>
            <div className={styles.legalLinks}>
              <div className={styles.termsOfUse}>Terms of Use</div>
              <div className={styles.privacyPolicy}>Privacy Policy</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.footerLinks}>
        <div className={styles.sitemap}>
          <h3 className={styles.sitemap2}>Sitemap</h3>
          <div className={styles.siteMapLinks}>
            <Link to="/" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Trang chủ</Link>
            <Link to="/nha_hang" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Nhà hàng</Link>
            <Link to="/category/trang_diem" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Trang điểm</Link>
            <Link to="/category/xe_hoa" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Xe hoa ngày cưới</Link>
            <Link to="/category/chup_anh" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Chụp ảnh cưới</Link>
            <Link to="/category/vay_cuoi" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Thuê váy & vest</Link>
          </div>
        </div>
        <div className={styles.sitemap}>
          <h3 className={styles.sitemap2}>newsletter</h3>
          <div className={styles.subscription}>
            <div className={styles.enterYouEmailAddressParent}>
              <div className={styles.enterYouEmail}>
                enter you email address
              </div>
              <input
                className={styles.frameChild}
                placeholder="subscribe"
                type="text"
              />
            </div>
            <div className={styles.subscriptionChild} />
          </div>
        </div>
      </div>
      <img className={styles.pathStrokeIcon} alt="" src="/Path-Stroke.svg" />
    </footer>
  );
};

Footer1.propTypes = {
  className: PropTypes.string,
};

export default Footer1;
