import { Link } from "react-router-dom";
import Cta1 from "./Cta1";
import PropTypes from "prop-types";
import styles from "./Footer2.module.css";

const Footer2 = ({ className = "" }) => {
  return (
    <section className={[styles.footer, className].join(" ")}>
      <div className={styles.footerInfo}>
        <h2 className={styles.title}>
          Our wedding planners will leave you breathless on your special day.
        </h2>
        <div className={styles.footerInfoInner}>
          <div className={styles.copyright2020LaaParent}>
            <div className={styles.copyright2020}>
              Copyright Dotcreativemarket
            </div>
            <div className={styles.termsOfUseParent}>
              <div className={styles.termsOfUse}>Terms of Use</div>
              <div className={styles.privacyPolicy}>Privacy Policy</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.sitemapParent}>
        <div className={styles.sitemap}>
          <div className={styles.sitemap2}>Sitemap</div>
          <div className={styles.homeParent}>
            <Link to="/" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Trang chủ</Link>
            <Link to="/nha_hang" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Nhà hàng</Link>
            <Link to="/category/trang_diem" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Trang điểm</Link>
            <Link to="/category/xe_hoa" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Xe hoa ngày cưới</Link>
            <Link to="/category/chup_anh" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Chụp ảnh cưới</Link>
            <Link to="/category/vay_cuoi" className={styles.home} style={{ textDecoration: "none", color: "inherit" }}>Thuê váy & vest</Link>
          </div>
        </div>
        <div className={styles.sitemap}>
          <div className={styles.sitemap2}>newsletter</div>
          <div className={styles.subscriptionForm}>
            <div className={styles.enterYouEmailAddressParent}>
              <div className={styles.enterYouEmail}>
                enter you email address
              </div>
              <div className={styles.subscribeButton}>
                <Cta1 property1="normal" />
              </div>
            </div>
            <div className={styles.subscriptionFormChild} />
          </div>
        </div>
      </div>
      <img className={styles.pathStrokeIcon} alt="" src="/Path-Stroke.svg" />
    </section>
  );
};

Footer2.propTypes = {
  className: PropTypes.string,
};

export default Footer2;
