import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./FrameComponent8.module.css";

const FrameComponent8 = ({ className = "" }) => {
  const navigate = useNavigate();
  return (
    <section className={[styles.frameParent, className].join(" ")}>
      <img className={styles.frameChild} alt="" src="/Group-241@2x.png" />
      <section className={styles.frameGroup}>
        <div className={styles.itsAllInTheDetailsParent}>
          <div className={styles.itsAllIn}>It’s all in the details</div>
          <h1 className={styles.tThuVy}>đặt Thuê váy, vest cưới</h1>
          <div className={styles.cpNhtNhng}>
            Cập nhật những xu hướng thời trang cưới mới nhất từ các thương hiệu
            cao cấp. Đa dạng kiểu dáng váy cưới lộng lẫy và bộ suit lịch lãm,
            được tinh chỉnh vừa vặn để hai bạn tự tin tỏa sáng nhất.
          </div>
        </div>
        <button 
          className={styles.lightbuttonsecondarytext}
          onClick={() => navigate("/category/vay_cuoi")}
        >
          <div className={styles.rectangle} />
          <div className={styles.button}>Tìm hiểu thêm</div>
        </button>
      </section>
      <img className={styles.spacerIcon} alt="" src="/Spacer@2x.png" />
      <img className={styles.vectorIcon} alt="" src="/Vector1.svg" />
      <img className={styles.icon} alt="" src="/03-1@2x.png" />
      <img className={styles.vectorIcon2} alt="" src="/Vector.svg" />
      <img className={styles.frameItem} alt="" src="/Group-3@2x.png" />
    </section>
  );
};

FrameComponent8.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent8;
