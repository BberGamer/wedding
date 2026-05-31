import PropTypes from "prop-types";
import styles from "./Component2.module.css";

const Component2 = ({ className = "" }) => {
  return (
    <section className={[styles.section, className].join(" ")}>
      <img className={styles.vectorIcon} alt="" src="/Vector.svg" />
      <img className={styles.icon} alt="" src="/03-2@2x.png" />
      <img className={styles.icon2} alt="" src="/06-1@2x.png" />
      <img className={styles.maskGroupIcon} alt="" src="/Mask-group@2x.png" />
      <div className={styles.rectangleParent}>
        <div className={styles.frameChild} />
        <div className={styles.theWeddingPartyParent}>
          <div className={styles.theWeddingParty}>The wedding party</div>
          <h1 className={styles.thuXeCi}>Thuê xe cưới</h1>
        </div>
        <section className={styles.serviceDetails}>
          <div className={styles.vectorParent}>
            <img className={styles.vectorIcon2} alt="" src="/Vector.svg" />
            <img
              className={styles.backgroundOverlayIcon}
              alt=""
              src="/Background-Overlay@2x.png"
            />
            <img
              className={styles.maskGroupIcon2}
              alt=""
              src="/Mask-group@2x.png"
            />
          </div>
        </section>
        <button className={styles.lightbuttonsecondarytext}>
          <div className={styles.rectangle} />
          <div className={styles.button}>Tìm hiểu thêm</div>
        </button>
      </div>
      <div className={styles.maskGroupWrapper}>
        <img
          className={styles.maskGroupIcon3}
          alt=""
          src="/Mask-group@2x.png"
        />
      </div>
    </section>
  );
};

Component2.propTypes = {
  className: PropTypes.string,
};

export default Component2;
