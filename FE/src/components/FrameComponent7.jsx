import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./FrameComponent7.module.css";

const FrameComponent7 = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <section className={[styles.frameParent, className].join(" ")}>
      <img className={styles.frameChild} alt="" src="/Group-240@2x.png" />
      <img
        className={styles.vectorIcon}
        loading="lazy"
        alt=""
        src="/Vector.svg"
      />
      <img className={styles.vectorIcon2} alt="" src="/Vector1.svg" />
      <section className={styles.frameGroup}>
        <div className={styles.elliteCateringParent}>
          <div className={styles.elliteCatering}>ELLITE CATERING</div>
          <h1 className={styles.chpNhCi}>Chụp ảnh cưới, phóng sự cưới</h1>
          <div className={styles.loremIpsumDolor}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
            aliquam mi id augue ultrices, in tempus elit tristique. Aliquam
            ultrices sem non.
          </div>
        </div>
        <button 
          className={styles.lightbuttonsecondarytext}
          onClick={() => navigate("/category/chup_anh")}
        >
          <div className={styles.rectangle} />
          <div className={styles.button}>Tìm hiểu thêm</div>
        </button>
      </section>
    </section>
  );
};

FrameComponent7.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent7;
