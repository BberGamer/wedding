import PropTypes from "prop-types";
import styles from "./Cta1.module.css";

const Cta1 = ({ className = "", property1 = "normal" }) => {
  return (
    <div
      className={[styles.cta, className].join(" ")}
      data-property1={property1}
    >
      <div className={styles.ctaChild} />
      <div className={styles.readMoreParent}>
        <div className={styles.readMore}>subscribe</div>
        <img
          className={styles.vectorStrokeIcon}
          alt=""
          src="/Vector-Stroke.svg"
        />
      </div>
      <div className={styles.ctaItem} />
    </div>
  );
};

Cta1.propTypes = {
  className: PropTypes.string,

  /** Variant props */
  property1: PropTypes.string,
};

export default Cta1;
