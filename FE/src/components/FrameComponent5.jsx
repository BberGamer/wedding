import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./FrameComponent5.module.css";

const FrameComponent5 = ({
  className = "",
  lifeIsAnEvent,
  cngNhauToNnMtKNim,
  chngTiYGipCcBnC,
  frame1321317479,
  frameSectionGap,
  chngTiHeight,
  frameIconHeight,
  frameIconWidth,
  categoryPath,
}) => {
  const navigate = useNavigate();

  const frameSectionStyle = useMemo(() => {
    return {
      gap: frameSectionGap,
    };
  }, [frameSectionGap]);

  const chngTiStyle = useMemo(() => {
    return {
      height: chngTiHeight,
    };
  }, [chngTiHeight]);

  const frameIconStyle = useMemo(() => {
    return {
      height: frameIconHeight,
      width: frameIconWidth,
    };
  }, [frameIconHeight, frameIconWidth]);

  const handleButtonClick = () => {
    if (categoryPath) {
      navigate(categoryPath);
    } else {
      navigate("/partner");
    }
  };

  return (
    <section
      className={[styles.frameParent, className].join(" ")}
      style={frameSectionStyle}
    >
      <section className={styles.frameGroup}>
        <div className={styles.lifeIsAnEventParent}>
          <div className={styles.lifeIsAn}>{lifeIsAnEvent}</div>
          <h1 className={styles.cngNhauTo}>{cngNhauToNnMtKNim}</h1>
          <div className={styles.chngTi} style={chngTiStyle}>
            {chngTiYGipCcBnC}
          </div>
        </div>
        <button 
          className={styles.lightbuttonsecondarytext}
          onClick={handleButtonClick}
        >
          <div className={styles.rectangle} />
          <div className={styles.button}>Tìm hiểu thêm</div>
        </button>
      </section>
      <img
        className={styles.frameChild}
        loading="lazy"
        alt=""
        src={frame1321317479}
        style={frameIconStyle}
      />
    </section>
  );
};

FrameComponent5.propTypes = {
  className: PropTypes.string,
  lifeIsAnEvent: PropTypes.string,
  cngNhauToNnMtKNim: PropTypes.string,
  chngTiYGipCcBnC: PropTypes.string,
  frame1321317479: PropTypes.string,

  /** Style props */
  frameSectionGap: PropTypes.string,
  chngTiHeight: PropTypes.string,
  frameIconHeight: PropTypes.string,
  frameIconWidth: PropTypes.string,
};

export default FrameComponent5;
