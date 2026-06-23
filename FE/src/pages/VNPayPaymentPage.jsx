import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VNPayPaymentPage.module.css";
import { API_URL } from "../config";

const BANK_NAME = "MB Bank";
const BANK_ID = "MB";
const ACCOUNT_NO = "0000866244999";
const ACCOUNT_NAME = "DO VAN BINH";

const VNPayPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from booking flow
  const { txnRef, amount, serviceName, selectedPackages, serviceId } = location.state || {
    txnRef: "ANW_MOCK_" + Date.now(),
    amount: 12500000,
    serviceName: "Dịch vụ cưới An Wedding",
    selectedPackages: "Gói Trọn Gói Cao Cấp",
    serviceId: ""
  };

  const user = (() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  // States
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // "pending", "awaiting_confirmation", "completed", "expired"
  const [toastMsg, setToastMsg] = useState("");

  // Generate dynamic VietQR image via VietQR API (MB Bank, DO VAN BINH, amount, txnRef)
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${amount}&addInfo=${txnRef}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setPaymentStatus("expired");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // SePay Webhook Auto-polling loop (Automatic detection)
  useEffect(() => {
    if (paymentStatus !== "pending" && paymentStatus !== "awaiting_confirmation") return;
    
    let active = true;
    
    const interval = setInterval(async () => {
      if (!active) return;
      try {
        const res = await fetch(`${API_URL}/api/payments/status/${txnRef}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            clearInterval(interval);
            active = false;
            setPaymentStatus("completed");
            
            // Redirect to success after 2 seconds
            setTimeout(() => {
              navigate("/payment/success", {
                state: {
                  txnRef,
                  amount,
                  serviceName,
                  selectedPackages,
                  bank: BANK_ID,
                  paymentDate: new Date().toLocaleString("vi-VN"),
                  status: "completed"
                }
              });
            }, 2000);
          }
        }
      } catch (err) {
        console.error("Lỗi thăm dò biến động số dư SePay:", err);
      }
    }, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [txnRef, navigate, amount, serviceName, selectedPackages, paymentStatus]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(val);
  };



  // Submit and confirm payment
  const completePayment = async (statusStr = "completed") => {
    setIsProcessing(true);
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${API_URL}/api/payments/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          txnRef: txnRef,
          status: statusStr
        })
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok) {
        setPaymentStatus("completed");
        setToastMsg("Giao dịch thành công! Đang chuyển hướng...");
        setTimeout(() => {
          navigate("/payment/success", {
            state: {
              txnRef,
              amount,
              serviceName,
              selectedPackages,
              bank: BANK_ID,
              paymentDate: new Date().toLocaleString("vi-VN"),
              status: statusStr
            }
          });
        }, 2000);
      } else {
        alert(data.message || "Xác nhận giao dịch thất bại từ server.");
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      // Fallback update local state & redirect
      setPaymentStatus("completed");
      setTimeout(() => {
        navigate("/payment/success", {
          state: {
            txnRef,
            amount,
            serviceName,
            selectedPackages,
            bank: BANK_ID,
            paymentDate: new Date().toLocaleString("vi-VN"),
            status: statusStr
          }
        });
      }, 2000);
    }
  };

  const handleCancelPayment = async () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy giao dịch thanh toán này?")) {
      try {
        const token = localStorage.getItem("token");
        if (token && txnRef && !txnRef.startsWith("ANW_MOCK_")) {
          await fetch(`${API_URL}/api/payments/cancel/${txnRef}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      } catch (err) {
        console.error("Lỗi khi hủy giao dịch:", err);
      }
      navigate(-1);
    }
  };

  return (
    <div className={styles.pageContainer}>
      {/* Toast Notification */}
      {toastMsg && (
        <div className={styles.toast}>
          {toastMsg}
        </div>
      )}

      {/* Header Bar */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.logoText}>AN WEDDING</span>
          <span className={styles.topbarDivider}>|</span>
          <span className={styles.topbarSubtitle}>Thanh toán chuyển khoản</span>
        </div>
        <button 
          type="button" 
          className={styles.topbarCancelBtn} 
          onClick={handleCancelPayment}
        >
          ✕ Hủy giao dịch
        </button>
      </header>

      {/* Main Body */}
      <main className={styles.mainContent}>
        <div className={styles.innerContainer}>
          
          <div className={styles.checkoutGrid}>
            
            {/* Left Column: QR and Bank Details */}
            <div className={styles.leftColumn}>
              
              {/* QR Code Card */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Mã QR quét thanh toán nhanh</h2>
                <div className={styles.qrSection}>
                  <div className={styles.qrWrapper}>
                    <img src={vietQrUrl} alt="VietQR Code" className={styles.qrImage} />
                  </div>
                  <div className={styles.qrInfoCol}>
                    {/* Countdown block */}
                    {paymentStatus === "pending" && (
                      <div className={styles.countdownInner}>
                        <span className={styles.clockIcon}>⏳</span>
                        <span>Thời gian còn lại: </span>
                        <span className={styles.timerVal}>{formatTime(timeLeft)}</span>
                      </div>
                    )}
                    <p className={styles.qrTip}>
                      Sử dụng ứng dụng ngân hàng quét mã QR để tự động điền đầy đủ thông tin tài khoản, số tiền và nội dung chuyển khoản.
                    </p>
                    <a 
                      href={vietQrUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      download="AN_WEDDING_QR.png" 
                      className={styles.downloadQrLink}
                    >
                      📥 Tải mã QR về máy
                    </a>
                  </div>
                </div>
              </div>

              {/* Bank Details Card */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Thông tin tài khoản ngân hàng</h2>
                
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Ngân hàng</span>
                    <span className={styles.infoValue}>{BANK_NAME}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Chủ tài khoản</span>
                    <span className={styles.infoValue}>{ACCOUNT_NAME}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Số tài khoản</span>
                    <span className={`${styles.infoValue} ${styles.highlightText}`}>{ACCOUNT_NO}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Số tiền cần chuyển</span>
                    <span className={`${styles.infoValue} ${styles.priceText}`}>{formatCurrency(amount)}</span>
                  </div>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Nội dung chuyển khoản</span>
                    <span className={`${styles.infoValue} ${styles.highlightText} ${styles.contentCode}`}>{txnRef}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Status */}
            <div className={styles.rightColumn}>
              
              {/* Payment Status Alert */}
              {paymentStatus === "awaiting_confirmation" && (
                <div className={`${styles.statusAlert} ${styles.statusAlertPending}`}>
                  <div className={styles.spinner} />
                  <div>
                    <h4 className={styles.statusTitle}>Đang chờ xác nhận</h4>
                    <p className={styles.statusText}>
                      Hệ thống đang kiểm tra giao dịch của bạn. Vui lòng giữ nguyên trang này.
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "completed" && (
                <div className={`${styles.statusAlert} ${styles.statusAlertSuccess}`}>
                  <div className={styles.statusIcon}>✓</div>
                  <div>
                    <h4 className={styles.statusTitle}>Đã thanh toán</h4>
                    <p className={styles.statusText}>
                      Thanh toán của bạn đã được xác nhận thành công. Đang chuyển hướng...
                    </p>
                  </div>
                </div>
              )}

              {paymentStatus === "expired" && (
                <div className={`${styles.statusAlert} ${styles.statusAlertError}`}>
                  <div className={styles.statusIcon}>✕</div>
                  <div>
                    <h4 className={styles.statusTitle}>Đã hết hạn</h4>
                    <p className={styles.statusText}>
                      Phiên thanh toán đã hết thời gian. Vui lòng thử lại.
                    </p>
                  </div>
                </div>
              )}

              <div className={styles.stickySummary}>
                <h3 className={styles.summaryTitle}>Tóm tắt đơn đặt lịch</h3>
                
                <div className={styles.summaryCard}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Mã đơn hàng:</span>
                    <span className={styles.summaryVal}>{txnRef}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Tên dịch vụ:</span>
                    <span className={`${styles.summaryVal} ${styles.valBold}`}>{serviceName}</span>
                  </div>

                  {selectedPackages && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryKey}>Dịch vụ phụ trợ:</span>
                      <span className={styles.summaryVal}>{selectedPackages}</span>
                    </div>
                  )}

                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Ngày đặt lịch:</span>
                    <span className={styles.summaryVal}>
                      {location.state?.bookingDate || new Date().toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className={styles.summaryDivider} />

                  <div className={styles.totalRow}>
                    <span className={styles.totalKey}>Tổng thanh toán</span>
                    <span className={styles.totalVal}>{formatCurrency(amount)}</span>
                  </div>
                </div>

                {/* Mock actions for admin user to simulate webhook completion */}
                {user?.role === "admin" && paymentStatus === "pending" && (
                  <div className={styles.adminSimulationBox}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "11px", fontWeight: "700", color: "#856404" }}>
                      ⚙️ ADMIN SIMULATION TOOL
                    </p>
                    <button
                      type="button"
                      className={styles.simPayBtn}
                      onClick={() => completePayment("completed")}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Đang xác thực..." : "✓ Giả lập đối soát thanh toán thành công"}
                    </button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className={styles.btnRow}>
                  {paymentStatus === "completed" && (
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.btnPrimary}`}
                      onClick={() => navigate("/profile")}
                    >
                      Xem chi tiết đơn hàng
                    </button>
                  )}

                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.btnOutline}`}
                    onClick={handleCancelPayment}
                  >
                    Quay lại đơn hàng
                  </button>
                  
                  <a
                    href="tel:0337774204"
                    className={`${styles.actionBtn} ${styles.btnSecondary}`}
                    style={{ textDecoration: "none" }}
                  >
                    📞 Liên hệ hỗ trợ
                  </a>
                </div>

              </div>

              <div className={styles.warningBoxMini}>
                ⚠️ <strong>Lưu ý:</strong> Hệ thống quét chuyển khoản tự động. Vui lòng điền đúng thông tin và số tiền.
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default VNPayPaymentPage;
