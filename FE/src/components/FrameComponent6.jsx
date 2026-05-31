import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./FrameComponent6.module.css";

const FrameComponent6 = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <section className={[styles.frameParent, className].join(" ")}>
      <img
        className={styles.frameChild}
        alt=""
        src="/Frame-1321317488@2x.png"
      />
      <section className={styles.frameGroup}>
        <div className={styles.weCreateYouCelebrateParent}>
          <div className={styles.weCreate}>We create . You celebrate</div>
          <h1 className={styles.nhHngTic}>nhà hàng tiệc cưới</h1>
          <div className={styles.khmPhH}>
            Khám phá hệ thống nhà hàng tiệc cưới sang trọng với đa dạng sảnh
            tiệc và sức chứa. Dễ dàng tham khảo thực đơn, so sánh dịch vụ và
            chốt lịch đặt tiệc nhanh chóng cho ngày vui trọn vẹn
          </div>
        </div>
        <button 
          className={styles.lightbuttonsecondarytext}
          onClick={() => navigate("/nha_hang")}
        >
          <div className={styles.rectangle} />
          <div className={styles.button}>Tìm hiểu thêm</div>
        </button>
      </section>
    </section>
  );
};

FrameComponent6.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent6;
