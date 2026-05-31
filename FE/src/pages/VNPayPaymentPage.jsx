import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./VNPayPaymentPage.module.css";
import { API_URL } from "../config";

const VNPayPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve state passed from ServiceDetailPage
  const { txnRef, amount, serviceName, selectedPackages, serviceId } = location.state || {
    txnRef: "ANW_MOCK_" + Date.now(),
    amount: 1500000,
    serviceName: "Dịch vụ cưới An Wedding",
    selectedPackages: "Gói cơ bản",
    serviceId: ""
  };

  const user = (() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  const [activeTab, setActiveTab] = useState("qr"); // "qr" or "card"
  const [selectedBank, setSelectedBank] = useState("vcb");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  
  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [issueMonth, setIssueMonth] = useState("");
  const [issueYear, setIssueYear] = useState("");
  
  // OTP Modal states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Bank Account Configuration for SePay dynamic QR Generation (DO VAN BINH - MB Bank)
  const BANK_ID = "MB"; // MB Bank (Mã ngân hàng)
  const ACCOUNT_NO = "0000866244999"; // Số tài khoản nhận tiền
  const ACCOUNT_NAME = "DO VAN BINH"; // Tên không dấu chủ tài khoản

  // Generate Napas dynamic VietQR url via VietQR API (free, secure and fast)
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${amount}&addInfo=${txnRef}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // Timer Countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // SePay Webhook Auto-polling loop
  useEffect(() => {
    let active = true;
    
    // Check order status every 3 seconds
    const interval = setInterval(async () => {
      if (!active) return;
      try {
        const res = await fetch(`${API_URL}/api/payments/status/${txnRef}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            clearInterval(interval);
            active = false;
            
            // Auto complete payment and redirect to success
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
  }, [txnRef, navigate, amount, serviceName, selectedPackages]);

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
          status: statusStr // "completed" or "failed"
        })
      });

      const data = await res.json();
      setIsProcessing(false);

      if (res.ok) {
        // Navigate to Success Page with full details
        navigate("/payment/success", {
          state: {
            txnRef,
            amount,
            serviceName,
            selectedPackages,
            bank: selectedBank.toUpperCase(),
            paymentDate: new Date().toLocaleString("vi-VN"),
            status: statusStr
          }
        });
      } else {
        alert(data.message || "Xác nhận giao dịch thất bại từ server.");
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      alert("Lỗi kết nối máy chủ. Đang tiến hành cập nhật cục bộ...");
      // Fallback redirect
      navigate("/payment/success", {
        state: {
          txnRef,
          amount,
          serviceName,
          selectedPackages,
          bank: selectedBank.toUpperCase(),
          paymentDate: new Date().toLocaleString("vi-VN"),
          status: statusStr
        }
      });
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !issueMonth || !issueYear) {
      alert("Vui lòng điền đầy đủ thông tin thẻ ATM nội địa!");
      return;
    }
    // Simulate sending OTP
    setShowOtpModal(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpCode !== "123456" && otpCode.length < 6) {
      alert("Vui lòng nhập đúng mã OTP xác thực (Mã mặc định: 123456)!");
      return;
    }
    setShowOtpModal(false);
    completePayment("completed");
  };

  const handleCancelPayment = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy giao dịch thanh toán này?")) {
      navigate(`/service/${serviceId}`);
    }
  };

  return (
    <div className={styles.paymentPage}>
      {/* Visual Header Cổng VNPay */}
      <header className={styles.gatewayHeader}>
        <div className={styles.headerLimit}>
          <div className={styles.logoRow}>
            <div className={styles.vnpayBrand}>
              <span className={styles.vn}>VNPAY</span>
              <span className={styles.gateway}>CỔNG THANH TOÁN</span>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.merchantInfo}>
              <span className={styles.merchantLabel}>ĐƠN VỊ CHẤP NHẬN THẺ</span>
              <span className={styles.merchantName}>AN WEDDING</span>
            </div>
          </div>
          <button className={styles.cancelBtn} onClick={handleCancelPayment}>
            Hủy giao dịch
          </button>
        </div>
      </header>

      {/* Main Payment Section */}
      <main className={styles.gatewayBody}>
        <div className={styles.bodyGrid}>
          {/* Cột trái: Thông tin đơn hàng */}
          <aside className={styles.orderSidebar}>
            <h3 className={styles.sidebarTitle}>Thông tin đơn hàng</h3>
            <div className={styles.orderCard}>
              <div className={styles.amountBlock}>
                <span className={styles.orderLabel}>SỐ TIỀN THANH TOÁN</span>
                <span className={styles.orderAmount}>{formatCurrency(amount)}</span>
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Mã giao dịch (Txn Ref):</span>
                <span className={styles.metaValue}>{txnRef}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Nhà cung cấp:</span>
                <span className={styles.metaValue}>{serviceName}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Dịch vụ đăng ký:</span>
                <span className={styles.metaValue}>{selectedPackages}</span>
              </div>
              <div className={styles.metaRow}>
                <span className={styles.metaKey}>Nội dung chuyển khoản:</span>
                <span className={styles.metaValue}>Thanh toan don hang {txnRef}</span>
              </div>

              <div className={styles.timerBlock}>
                <span className={styles.timerIcon}>⏳</span>
                <span>Giao dịch hết hạn sau: </span>
                <span className={styles.timeVal}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </aside>

          {/* Cột phải: Phương thức thanh toán */}
          <section className={styles.paymentMethodsSection}>
            <div className={styles.methodsCard}>
              {/* Tab selector */}
              <div className={styles.tabsHeader}>
                <button
                  className={`${styles.tabBtn} ${activeTab === "qr" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("qr")}
                >
                  <span className={styles.tabIcon}>📱</span>
                  <span>THANH TOÁN QUÉT MÃ QR</span>
                </button>
                <button
                  className={`${styles.tabBtn} ${activeTab === "card" ? styles.activeTab : ""}`}
                  onClick={() => setActiveTab("card")}
                >
                  <span className={styles.tabIcon}>💳</span>
                  <span>THẺ ATM / TÀI KHOẢN NỘI ĐỊA</span>
                </button>
              </div>

              {/* Nội dung Tab QR */}
              {activeTab === "qr" && (
                <div className={styles.tabContent}>
                  <div className={styles.qrGrid}>
                    <div className={styles.qrVisualBlock}>
                      <div className={styles.qrFrame} style={{ padding: 0, overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {/* Real Dynamic VietQR Image */}
                        <img 
                          src={vietQrUrl} 
                          alt="VietQR Code" 
                          style={{ width: "190px", height: "190px", objectFit: "contain", display: "block" }} 
                        />
                      </div>
                      <div className={styles.scanOutline}>
                        <div className={styles.scanLaser}></div>
                      </div>
                    </div>

                    <div className={styles.qrInstructions}>
                      <h4>Hướng dẫn thanh toán bằng QR Code:</h4>
                      <ol>
                        <li>Mở ứng dụng Mobile Banking trên điện thoại của bạn (Vietcombank, Techcombank, Agribank, etc.).</li>
                        <li>Chọn tính năng <strong>Quét mã QR</strong> trên ứng dụng.</li>
                        <li>Quét mã QR hiển thị ở khung bên trái để tự động nạp thông tin giao dịch.</li>
                        <li>Xác nhận số tiền thanh toán <strong>{formatCurrency(amount)}</strong> và hoàn thành mật khẩu/OTP trên điện thoại.</li>
                      </ol>

                      {user?.role === "admin" && (
                        <div className={styles.mockActions}>
                          <button 
                            className={styles.simPayBtn} 
                            onClick={() => completePayment("completed")}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Đang xác nhận..." : "✓ Giả lập Quét mã & Thanh toán Thành công"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Nội dung Tab Thẻ ATM */}
              {activeTab === "card" && (
                <div className={styles.tabContent}>
                  {/* Grid chọn ngân hàng */}
                  <div className={styles.bankGridHeader}>Chọn ngân hàng phát hành thẻ:</div>
                  <div className={styles.bankGrid}>
                    {[
                      { id: "vcb", name: "Vietcombank" },
                      { id: "tcb", name: "Techcombank" },
                      { id: "bidv", name: "BIDV" },
                      { id: "agr", name: "Agribank" },
                      { id: "vtb", name: "VietinBank" },
                      { id: "mb", name: "MBBank" },
                      { id: "tpb", name: "TPBank" },
                      { id: "acb", name: "ACB" }
                    ].map((bank) => (
                      <div
                        key={bank.id}
                        className={`${styles.bankLogoCard} ${selectedBank === bank.id ? styles.bankLogoSelected : ""}`}
                        onClick={() => setSelectedBank(bank.id)}
                      >
                        <span className={styles.bankMockLogo}>{bank.id.toUpperCase()}</span>
                        <span className={styles.bankNameLabel}>{bank.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Form thông tin thẻ */}
                  <form className={styles.cardForm} onSubmit={handleCardSubmit}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>SỐ THẺ ATM NỘI ĐỊA</label>
                        <input
                          type="text"
                          className={styles.fieldInput}
                          placeholder="9704 36xx xxxx xxxx"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/[^0-9]/g, ""))}
                          required
                        />
                        <span className={styles.inputHelp}>Mẹo: Nhập dãy số bất kỳ ví dụ: 9704 3600 1234 5678</span>
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>TÊN CHỦ THẺ (KHÔNG DẤU)</label>
                        <input
                          type="text"
                          className={styles.fieldInput}
                          placeholder="NGUYEN VAN A"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRowDouble}>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>THÁNG PHÁT HÀNH</label>
                        <select 
                          className={styles.fieldSelect} 
                          value={issueMonth} 
                          onChange={(e) => setIssueMonth(e.target.value)} 
                          required
                        >
                          <option value="">Tháng</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                              {(i + 1).toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.fieldLabel}>NĂM PHÁT HÀNH</label>
                        <select 
                          className={styles.fieldSelect} 
                          value={issueYear} 
                          onChange={(e) => setIssueYear(e.target.value)} 
                          required
                        >
                          <option value="">Năm</option>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = new Date().getFullYear() - 5 + i;
                            return (
                              <option key={year} value={year.toString().slice(-2)}>
                                {year}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <button type="submit" className={styles.cardPayBtn}>
                      XÁC NHẬN THANH TOÁN
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* OTP Confirmation Modal */}
      {showOtpModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.otpModal}>
            <div className={styles.modalHeader}>
              <h4>XÁC THỰC MÃ OTP GD</h4>
              <button className={styles.closeModalBtn} onClick={() => setShowOtpModal(false)}>✕</button>
            </div>
            <form className={styles.modalBody} onSubmit={handleOtpSubmit}>
              <p className={styles.otpPrompt}>
                Hệ thống ngân hàng đã gửi một mã xác thực OTP đến số điện thoại của bạn liên kết với ngân hàng <strong>{selectedBank.toUpperCase()}</strong>.
              </p>
              <div className={styles.otpInputRow}>
                <label className={styles.fieldLabel}>MÃ OTP XÁC THỰC (MÃ MẶC ĐỊNH: 123456)</label>
                <input
                  type="password"
                  maxLength={6}
                  className={styles.otpInput}
                  placeholder="------"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
                  autoFocus
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.otpConfirmBtn} disabled={isProcessing}>
                  {isProcessing ? "Đang xác thực..." : "XÁC NHẬN"}
                </button>
                <button type="button" className={styles.otpCancelBtn} onClick={() => setShowOtpModal(false)}>
                  HỦY BỎ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VNPayPaymentPage;
