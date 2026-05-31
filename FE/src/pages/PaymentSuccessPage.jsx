import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./PaymentSuccessPage.module.css";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(true);

  // Retrieve payment info from router state
  const { txnRef, amount, serviceName, selectedPackages, bank, paymentDate, status } = 
    location.state || {
      txnRef: "ANW_MOCK_177929",
      amount: 1500000,
      serviceName: "Nhà hàng tiệc cưới La Maison 1888",
      selectedPackages: "Gói Tiệc Bạc",
      bank: "VIETCOMBANK",
      paymentDate: new Date().toLocaleString("vi-VN"),
      status: "completed"
    };

  useEffect(() => {
    // Automatically fade out confetti elements after 8 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={styles.container}>
      <SharedHeader />

      {/* Pure CSS Confetti Celebrations */}
      {showConfetti && (
        <div className={styles.confettiContainer}>
          {Array.from({ length: 50 }).map((_, idx) => {
            const size = Math.random() * 8 + 6;
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 3;
            const colorList = ["#c3937c", "#4d5637", "#9d7236", "#e2b43b", "#e23b3b", "#005baa"];
            const bg = colorList[Math.floor(Math.random() * colorList.length)];
            return (
              <div
                key={idx}
                className={styles.confettiPiece}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                  backgroundColor: bg
                }}
              />
            );
          })}
        </div>
      )}

      <main className={styles.mainContent}>
        <div className={styles.receiptCard}>
          {/* Status Icon */}
          <div className={styles.successIconWrapper}>
            <div className={styles.successIcon}>✓</div>
            <div className={styles.ripple}></div>
          </div>

          <h1 className={styles.pageTitle}>Thanh toán thành công!</h1>
          <p className={styles.subtext}>
            Chúc mừng bạn! Giao dịch đặt dịch vụ tiệc cưới của bạn đã được cổng thanh toán VNPay xử lý và ghi nhận thành công vào hệ thống.
          </p>

          <div className={styles.divider}></div>

          {/* Receipt Info Table */}
          <div className={styles.receiptDetails}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>MÃ GIAO DỊCH (TXN REF)</span>
              <span className={styles.detailValue} style={{ color: "#4d5637", fontWeight: 700 }}>
                {txnRef}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>TÊN DỊCH VỤ CƯỚI</span>
              <span className={styles.detailValue}>{serviceName}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>GÓI LỰA CHỌN</span>
              <span className={styles.detailValue}>{selectedPackages}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>NGÂN HÀNG THANH TOÁN</span>
              <span className={styles.detailValue}>{bank}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>THỜI GIAN GIAO DỊCH</span>
              <span className={styles.detailValue}>{paymentDate}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>PHƯƠNG THỨC</span>
              <span className={styles.detailValue}>Cổng VNPay (Thẻ/QR Code)</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>TRẠNG THÁI</span>
              <span className={`${styles.detailValue} ${styles.statusBadge}`}>
                THÀNH CÔNG
              </span>
            </div>

            <div className={styles.divider} style={{ margin: "20px 0" }}></div>

            <div className={styles.totalBlock}>
              <span className={styles.totalLabel}>TỔNG TIỀN ĐÃ THANH TOÁN</span>
              <span className={styles.totalValue}>{formatCurrency(amount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <Link to="/profile" className={styles.primaryBtn}>
              📜 XEM ĐƠN ĐẶT DỊCH VỤ
            </Link>
            <Link to="/" className={styles.secondaryBtn}>
              🏠 VỀ TRANG CHỦ
            </Link>
          </div>

          <p className={styles.mailPrompt}>
            Hóa đơn điện tử VAT và thông tin lịch trình phục vụ chi tiết đã được gửi về email của bạn. Xin cám ơn quý khách!
          </p>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default PaymentSuccessPage;
