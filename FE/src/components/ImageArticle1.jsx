import Box1 from "./Box1";
import PropTypes from "prop-types";
import styles from "./ImageArticle1.module.css";

const ImageArticle1 = ({ className = "" }) => {
  return (
    <section className={[styles.imageArticle, className].join(" ")}>
      <img className={styles.maskGroupIcon} alt="" src="/Mask-group@2x.png" />
      <div className={styles.articleLayout}>
        <div className={styles.articleBoxParent}>
          <div className={styles.articleBox}>
            <div className={styles.box2}>
              <div className={styles.september82022Wrapper}>
                <div className={styles.september82022}>September 8, 2022</div>
              </div>
              <h2
                className={styles.betterPlanningTips}
              >{`Better planning tips for weddings & more ideas`}</h2>
              <div className={styles.readMoreParent}>
                <div className={styles.readMore}>read more</div>
                <div className={styles.pathStrokeWrapper}>
                  <img
                    className={styles.pathStrokeIcon}
                    loading="lazy"
                    alt=""
                    src="/Path-Stroke.svg"
                  />
                </div>
              </div>
            </div>
          </div>
          <Box1
            december082022="December 08, 2022"
            benefitsOfHiringTheBestEvent="Benefits of hiring the best event technologist"
          />
        </div>
      </div>
    </section>
  );
};

ImageArticle1.propTypes = {
  className: PropTypes.string,
};

export default ImageArticle1;
