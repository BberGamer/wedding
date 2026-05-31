import PropTypes from "prop-types";
import styles from "./FrameComponent9.module.css";

const FrameComponent9 = ({ className = "" }) => {
  return (
    <section className={[styles.frameParent, className].join(" ")}>
      <section className={styles.frameGroup}>
        <div className={styles.infoBackgroundParent}>
          <img
            className={styles.infoBackgroundIcon}
            alt=""
            src="/Info-Background@2x.png"
          />
          <img className={styles.vectorIcon} alt="" src="/Vector.svg" />
        </div>
        <img className={styles.maskGroupIcon} alt="" src="/Mask-group@2x.png" />
        <div className={styles.overlayDetailsParent}>
          <img
            className={styles.infoBackgroundIcon}
            alt=""
            src="/Overlay-Details@2x.png"
          />
          <img className={styles.vectorIcon2} alt="" src="/Vector1.svg" />
        </div>
      </section>
      <section className={styles.contactInfo}>
        <div className={styles.contentForm}>
          <div className={styles.readyToGet}>READY TO GET IN TOUCH?</div>
          <div className={styles.content}>
            <h2 className={styles.title}>wedding planner</h2>
            <div className={styles.name}>
              <input
                className={styles.nameChild}
                placeholder="Tên của bạn"
                type="text"
              />
              <div className={styles.nameItem} />
            </div>
            <div className={styles.phone}>
              <div className={styles.name}>
                <input
                  className={styles.frameChild}
                  placeholder="Số điện thoại"
                  type="text"
                />
                <div className={styles.frameItem} />
              </div>
            </div>
            <div className={styles.phone}>
              <div className={styles.name}>
                <input
                  className={styles.frameChild}
                  placeholder="Email"
                  type="text"
                />
                <div className={styles.frameItem} />
              </div>
            </div>
            <div className={styles.phone}>
              <div className={styles.name}>
                <input
                  className={styles.frameChild}
                  placeholder="Dự kiến tổ chức vào ngày"
                  type="text"
                />
                <div className={styles.frameItem} />
              </div>
            </div>
          </div>
        </div>
        <button className={styles.lightbuttonsecondarytext}>
          <div className={styles.rectangle} />
          <div className={styles.button}>Gửi thông tin</div>
        </button>
      </section>
    </section>
  );
};

FrameComponent9.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent9;
