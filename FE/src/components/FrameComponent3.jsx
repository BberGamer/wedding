import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./FrameComponent3.module.css";

const FrameComponent3 = ({
  className = "",
  restaurantDetails,
  nhHngTicCiSnGolfSngB,
  thnhPhThunAnBnhDng,
  starsFirst,
  starsSecond,
  starsThird,
  starsFourth,
  starsFifth,
  nHNBOGI,
  frameDivGridColumn,
  frameDivWidth,
  frameDivGridRow,
}) => {
  return (
    <div
      className={[styles.restaurantDetailsParent, className].join(" ")}
    >
      <img
        className={styles.restaurantDetailsIcon}
        loading="lazy"
        alt=""
        src={restaurantDetails}
      />
      <div className={styles.restaurantLabels}>
        <div className={styles.nhHngTic}>{nhHngTicCiSnGolfSngB}</div>
        <div className={styles.thnhPhThun}>{thnhPhThunAnBnhDng}</div>
        <div className={styles.ratingStars}>
          <img
            className={styles.starsFirstIcon}
            loading="lazy"
            alt=""
            src={starsFirst}
          />
          <img
            className={styles.starsFirstIcon}
            loading="lazy"
            alt=""
            src={starsSecond}
          />
          <img
            className={styles.starsFirstIcon}
            loading="lazy"
            alt=""
            src={starsThird}
          />
          <img
            className={styles.starsFirstIcon}
            loading="lazy"
            alt=""
            src={starsFourth}
          />
          <img className={styles.starsFirstIcon} alt="" src={starsFifth} />
        </div>
      </div>
      <div className={styles.quoteButtons}>
        <div className={styles.nhnBoGi}>{nHNBOGI}</div>
      </div>
    </div>
  );
};

FrameComponent3.propTypes = {
  className: PropTypes.string,
  restaurantDetails: PropTypes.string,
  nhHngTicCiSnGolfSngB: PropTypes.string,
  thnhPhThunAnBnhDng: PropTypes.string,
  starsFirst: PropTypes.string,
  starsSecond: PropTypes.string,
  starsThird: PropTypes.string,
  starsFourth: PropTypes.string,
  starsFifth: PropTypes.string,
  nHNBOGI: PropTypes.string,

  /** Style props */
  frameDivGridColumn: PropTypes.string,
  frameDivWidth: PropTypes.string,
  frameDivGridRow: PropTypes.string,
};

export default FrameComponent3;
