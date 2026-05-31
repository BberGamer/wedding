import PropTypes from "prop-types";
import styles from "./HeroContent1.module.css";

const HeroContent1 = ({ className = "" }) => {
  return (
    <section className={[styles.heroContent, className].join(" ")}>
      <div className={styles.sectionHeroWrapper}>
        <div className={styles.sectionHero}>
          <div className={styles.frameParent}>
            <div className={styles.frameGroup}>
              <img
                className={styles.frameChild}
                alt=""
                src="/Frame-233@2x.png"
              />
              <div className={styles.nhHngTrung}>
                NHÀ HÀNG,
                <br />
                TRUNG TÂM TIỆC CƯỚI
              </div>
            </div>
            <div className={styles.frameWrapper}>
              <div className={styles.frameContainer}>
                <div className={styles.subtitleElementsParent}>
                  <div className={styles.subtitleElements}>
                    <img
                      className={styles.subtitleElementsChild}
                      loading="lazy"
                      alt=""
                      src="/Vector-38.svg"
                    />
                  </div>
                  <div className={styles.risusScelerisqueA}>
                    Risus scelerisque a non turpis vitae malesuada sed
                    venenatis. In fringilla sollicitudin euismod sed.
                  </div>
                </div>
                <div className={styles.buttonContainerWrapper}>
                  <div className={styles.buttonContainer}>
                    <div className={styles.buttonContainerInner}>
                      <div className={styles.discoverParent}>
                        <div className={styles.discover}>DISCOVER</div>
                        <div className={styles.vectorParent}>
                          <img
                            className={styles.vectorIcon}
                            loading="lazy"
                            alt=""
                            src="/Vector.svg"
                          />
                          <img
                            className={styles.frameItem}
                            alt=""
                            src="/Ellipse-12.svg"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.rectangleParent}>
                      <div className={styles.frameInner} />
                      <img
                        className={styles.placeholderIcon}
                        alt=""
                        src="/Placeholder@2x.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <img
            className={styles.layer1Icon}
            loading="lazy"
            alt=""
            src="/Layer-1.svg"
          />
        </div>
      </div>
      <div className={styles.searchHeader}>
        <div className={styles.tnCaHng}>Tên cửa hàng</div>
        <div className={styles.tdesignsearch}>
          <img
            className={styles.groupIcon}
            loading="lazy"
            alt=""
            src="/Group.svg"
          />
        </div>
      </div>
    </section>
  );
};

HeroContent1.propTypes = {
  className: PropTypes.string,
};

export default HeroContent1;
