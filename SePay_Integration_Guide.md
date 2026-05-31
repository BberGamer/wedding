# HƯỚNG DẪN TÍCH HỢP CỔNG THANH TOÁN TỰ ĐỘNG SEPAY
## Hệ Thống Đặt Dịch Vụ Cưới AN Wedding (Nền tảng VietQR & Webhook)

Tài liệu này hướng dẫn chi tiết từng bước từ mặt lý thuyết, cấu hình tài khoản SePay đến việc viết mã nguồn cụ thể ở cả **Backend (Node.js/Express)** và **Frontend (React)** để tích hợp thành công cổng thanh toán quét mã QR tự động xác thực thời gian thực.

---

## 💡 1. Nguyên Lý Hoạt Động Của SePay

Thay vì phải liên kết phức tạp với các cổng thanh toán cần giấy phép kinh doanh (như VNPay, MoMo doanh nghiệp), **SePay.vn** cho phép bạn tự động hóa việc nhận tiền bằng tài khoản ngân hàng cá nhân thông qua quét mã VietQR và kiểm tra biến động số dư.

### Quy trình dòng chảy dữ liệu (Dataflow):
1. **Khách hàng** chọn gói dịch vụ cưới trên website và bấm nút "Thanh toán".
2. **Website** tạo đơn hàng trong Database (`pending`), lấy mã giao dịch `txnRef` (Ví dụ: `ANW_17156291`).
3. **Frontend** tạo ra mã **VietQR động** chứa:
   * Số tài khoản ngân hàng của bạn.
   * Số tiền chính xác của đơn đặt lịch.
   * Nội dung chuyển khoản bắt buộc: Mã `txnRef` (Ví dụ: `ANW17156291`).
4. **Khách hàng** mở app ngân hàng, quét mã QR và thực hiện chuyển khoản. Số tiền chuyển khoản sẽ đi **trực tiếp vào tài khoản ngân hàng cá nhân của bạn**.
5. **SePay** quét tài khoản của bạn (qua App/API ngân hàng), phát hiện biến động số dư tăng chứa nội dung `ANW17156291`.
6. **SePay** lập tức gọi một yêu cầu HTTP POST (**Webhook**) tới API của hệ thống chúng ta.
7. **Backend** của chúng ta bắt Webhook này, giải mã nội dung chuyển khoản để lấy mã `txnRef`, xác minh số tiền, và chuyển trạng thái đơn hàng thành Đã hoàn tất (`completed`).
8. **Frontend** trang thanh toán tự động nhận biết đơn hàng đã đổi trạng thái và chuyển hướng khách hàng sang trang **Thành công**.

---

## ⚙️ 2. Các Bước Thiết Lập Trên SePay.vn

1. **Đăng ký tài khoản:** Truy cập [SePay.vn](https://sepay.vn) và đăng ký tài khoản.
2. **Liên kết Ngân hàng:** Vào mục **Ngân hàng** -> Bấm **Liên kết Ngân hàng** và làm theo hướng dẫn để kết nối tài khoản của bạn (hỗ trợ nhiều ngân hàng phổ biến: MB Bank, VietinBank, Techcombank, ACB...).
3. **Lấy API Key bảo mật:**
   * Truy cập mục **Tích hợp API** trên SePay Dashboard.
   * Tạo một API Key mới. Lưu trữ API Key này cẩn thận, chúng ta sẽ đưa vào file `.env` phía Backend dưới tên `SEPAY_API_KEY`.
4. **Cấu hình Webhook:**
   * Trong mục **Webhook** trên SePay -> Bấm **Thêm Webhook**.
   * URL nhận Webhook: `http://<domain-cua-ban>/api/payments/sepay-webhook` (Để chạy thử nghiệm trên máy local, bạn cần dùng công cụ như **ngrok** hoặc **LocalTunnel** để tạo tên miền công khai trỏ về cổng local `5000` của bạn, ví dụ: `https://abcd-123.ngrok-free.app/api/payments/sepay-webhook`).
   * Chọn sự kiện: **Nhận tiền (Transactions)**.
   * Thiết lập **Token bảo mật** (Secret Token) để Backend của bạn kiểm tra tính hợp pháp của gói dữ liệu gửi từ SePay.

---

## 💻 3. Tích Hợp Backend (Node.js & Express)

Chúng ta cần viết thêm một API Webhook đón dữ liệu từ SePay và cập nhật cơ sở dữ liệu MongoDB.

### Bước A: Thêm biến môi trường vào `BE/.env`
Mở file [BE/.env](file:///e:/Wedding/BE/.env) và thêm mã bảo mật Webhook mà bạn đã tạo trên SePay:
```env
SEPAY_WEBHOOK_TOKEN=your_sepay_webhook_secret_token
```

### Bước B: Tạo Endpoint Webhook trong `BE/controllers/paymentController.js`
Bạn có thể chèn hàm `sepayWebhook` sau vào cuối file controller của bạn để xử lý luồng nhận tiền tự động:

```javascript
// BE/controllers/paymentController.js
// Thêm hàm xử lý Webhook từ SePay

exports.sepayWebhook = async (req, res) => {
  try {
    // 1. Kiểm tra Token bảo mật gửi từ SePay để tránh giả mạo yêu cầu
    const webhookToken = req.headers["x-sepay-token"] || req.headers["authorization"];
    if (webhookToken !== process.env.SEPAY_WEBHOOK_TOKEN) {
      return res.status(401).json({ success: false, message: "Token bảo mật SePay không hợp lệ" });
    }

    // 2. Nhận các trường dữ liệu từ SePay gửi qua Body
    const { 
      gateway,        // Tên ngân hàng nhận tiền
      amount,         // Số tiền thực tế nhận được
      code,           // Nội dung chuyển khoản chuyển đến (Ví dụ: "ANW17156291")
      transactionDate // Thời gian giao dịch phát sinh
    } = req.body;

    if (!code || !amount) {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu giao dịch cốt lõi" });
    }

    // 3. Sử dụng Regular Expression để bóc tách mã txnRef từ nội dung chuyển khoản.
    // Ví dụ, khách hàng quét QR có nội dung "Thanh toan don hang ANW_17283921_123" hoặc ghi đơn giản "ANW_17283921_123"
    // Chúng ta tìm chuỗi bắt đầu bằng ANW_...
    const match = code.toUpperCase().match(/(ANW_\d+_\d+)/);
    if (!match) {
      return res.status(400).json({ success: false, message: "Nội dung chuyển khoản không khớp định dạng đơn hàng ANW" });
    }
    
    const extractedTxnRef = match[1]; // Trả về "ANW_17283921_123"

    // 4. Tìm kiếm đơn hàng trong Database
    const order = await Order.findOne({ txnRef: extractedTxnRef });
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy mã đơn hàng khớp với giao dịch này" });
    }

    // 5. Kiểm tra nếu đơn hàng đã được thanh toán rồi
    if (order.status === "completed") {
      return res.json({ success: true, message: "Đơn hàng này đã được phê duyệt thanh toán trước đó" });
    }

    // 6. Kiểm tra so khớp số tiền (Đảm bảo khách hàng không sửa tiền khi chuyển khoản)
    if (Number(amount) < order.amount) {
      return res.status(400).json({ 
        success: false, 
        message: `Số tiền chuyển khoản (${amount}đ) nhỏ hơn tổng tiền đơn hàng (${order.amount}đ)` 
      });
    }

    // 7. Cập nhật đơn hàng thành công trong Database
    order.status = "completed";
    order.paymentDate = new Date(transactionDate || Date.now());
    await order.save();

    console.log(`[SePay Webhook] Đơn hàng ${extractedTxnRef} đã thanh toán tự động thành công qua QR!`);

    res.json({ success: true, message: "Đơn hàng đã được duyệt thanh toán tự động thành công!" });
  } catch (error) {
    console.error("[SePay Error]:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Hàm phụ để kiểm tra trạng thái đơn hàng theo thời gian thực (Frontend Polling)
exports.getOrderStatus = async (req, res) => {
  try {
    const { txnRef } = req.params;
    const order = await Order.findOne({ txnRef }).select("status amount createdAt");
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng tương ứng" });
    }
    res.json({ status: order.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Bước C: Đăng ký Router trong `BE/routes/paymentRoutes.js`
Bạn cần mở file [BE/routes/paymentRoutes.js](file:///e:/Wedding/BE/routes/paymentRoutes.js) và thêm dòng sau (Chú ý: webhook của SePay không đi kèm JWT Header của user chúng ta, vì vậy **không** dùng middleware `protect` cho webhook):

```javascript
// Đăng ký Webhook SePay (Không bảo vệ bằng protect vì SePay gọi trực tiếp)
const { sepayWebhook, getOrderStatus } = require("../controllers/paymentController");

router.post("/sepay-webhook", sepayWebhook);
router.get("/status/:txnRef", getOrderStatus); // API để client thăm dò trạng thái
```

---

## 🎨 4. Tích Hợp Frontend (React)

Thay thế giao diện VNPay cũ bằng một thẻ thanh toán QR chuẩn **Napas VietQR** lộng lẫy và thiết lập cơ chế kiểm tra tự động.

### Bước A: Tạo giao diện quét mã QR động tại Frontend
Sử dụng API hoàn toàn miễn phí của `VietQR.io` để sinh mã QR tức thì.
Công thức gọi ảnh VietQR động:
```
https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-template.png?amount=<AMOUNT>&addInfo=<txnRef>&accountName=<ACC_NAME>
```
*Ví dụ cấu hình của bạn:*
* Ngân hàng nhận tiền: Quân Đội (MB Bank) ⇄ `MB`
* Số tài khoản: `190283921932`
* Tên chủ tài khoản: `NGUYEN VAN AN`

### Bước B: Viết mã nguồn kiểm tra trạng thái tự động (Long Polling)
Trong trang thanh toán của bạn, khi giao diện QR hiện lên, chúng ta cho chạy một hàm `setInterval` gọi API `/api/payments/status/:txnRef` liên tục để xem khi nào SePay báo có biến động số dư.

Mẫu code Frontend React sạch sẽ để tích hợp:

```jsx
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./SePayPaymentPage.module.css"; // Styles luxury của bạn

const SePayPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Nhận dữ liệu truyền từ trang chi tiết gói cưới
  const { txnRef, amount, serviceName, selectedPackages, serviceId } = location.state || {
    txnRef: "ANW_MOCK_123",
    amount: 1500000,
    serviceName: "Nhà hàng tiệc cưới La Maison",
    selectedPackages: "Gói Tiệc Bạc",
    serviceId: ""
  };

  const [timeLeft, setTimeLeft] = useState(900); // 15 phút đếm ngược
  const [paymentStatus, setPaymentStatus] = useState("pending");

  // Thiết lập tài khoản ngân hàng của bạn nhận tiền
  const BANK_ID = "MB"; // Mã ngân hàng MB Bank
  const ACCOUNT_NO = "190283921932"; // Số tài khoản của bạn
  const ACCOUNT_NAME = "NGUYEN VAN AN"; // Tên không dấu chủ tài khoản

  // Tạo URL VietQR tự động
  const vietQrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-qr_only.png?amount=${amount}&addInfo=${txnRef}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  // 1. Đồng hồ đếm ngược 15 phút
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // 2. Cơ chế Thăm dò Trạng thái Tự động (Long Polling)
  // Quét cứ mỗi 3 giây để xem biến động số dư đã hoàn thành chưa
  useEffect(() => {
    if (paymentStatus === "completed") return;

    const checkInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payments/status/${txnRef}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "completed") {
            setPaymentStatus("completed");
            clearInterval(checkInterval);
            
            // Đã nhận được tiền -> Chuyển ngay đến trang Success
            navigate("/payment/success", {
              state: {
                txnRef,
                amount,
                serviceName,
                selectedPackages,
                bank: BANK_ID,
                paymentDate: new Date().toLocaleString("vi-VN"),
                status: "completed",
                method: "Chuyển khoản VietQR tự động"
              }
            });
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra trạng thái giao dịch:", err);
      }
    }, 3000); // Thăm dò trạng thái mỗi 3 giây

    return () => clearInterval(checkInterval);
  }, [txnRef, paymentStatus, navigate, amount, serviceName, selectedPackages]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(val);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.paymentCard}>
        <div className={styles.header}>
          <h2>QUÉT MÃ VIETQR ĐỂ ĐẶT LỊCH</h2>
          <p className={styles.subtitle}>Giao dịch thanh toán an toàn trực tiếp qua ngân hàng</p>
        </div>

        <div className={styles.bodyGrid}>
          {/* Cột 1: Hiển thị mã QR ngân hàng */}
          <div className={styles.qrCol}>
            <div className={styles.qrWrapper}>
              <img src={vietQrUrl} alt="VietQR Code" className={styles.qrImg} />
            </div>
            <div className={styles.pulseIndicator}>
              <span className={styles.pulseDot}></span>
              <span>Đang chờ hệ thống kiểm tra số dư tự động...</span>
            </div>
          </div>

          {/* Cột 2: Thông tin chi tiết */}
          <div className={styles.infoCol}>
            <div className={styles.amountBox}>
              <span className={styles.label}>TỔNG TIỀN CẦN CHUYỂN</span>
              <h3 className={styles.price}>{formatCurrency(amount)}</h3>
            </div>

            <div className={styles.detailsList}>
              <div className={styles.detailRow}>
                <strong>Chủ tài khoản:</strong>
                <span>{ACCOUNT_NAME}</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Số tài khoản:</strong>
                <span>{ACCOUNT_NO} ({BANK_ID})</span>
              </div>
              <div className={styles.detailRow}>
                <strong>Nội dung bắt buộc:</strong>
                <span className={styles.highlight}>{txnRef}</span>
              </div>
            </div>

            <div className={styles.warningAlert}>
              ⚠️ <strong>Lưu ý quan trọng:</strong> Quý khách vui lòng chuyển khoản đúng số tiền và giữ nguyên nội dung chuyển khoản được điền sẵn là <strong>{txnRef}</strong> để hệ thống tự động xác nhận đặt lịch ngay tức khắc.
            </div>

            <div className={styles.timer}>
              Giao dịch sẽ hết hiệu lực sau: <strong>{formatTime(timeLeft)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SePayPaymentPage;
```

---

## 🏁 5. Kết Luận & Khuyến Nghị

* **Độ tin cậy cao:** SePay xử lý tự động trong khoảng **1 - 3 giây** ngay sau khi tài khoản của bạn nhận được tiền. Khách hàng sẽ thấy trang web tự động chuyển sang trang thành công cực kỳ bất ngờ và chuyên nghiệp.
* **Bảo mật Webhook:** Hãy đảm bảo bạn luôn kiểm tra header `x-sepay-token` ở Backend để đảm bảo rằng yêu cầu thực sự đến từ SePay, tránh việc kẻ xấu gọi khống API duyệt đơn của bạn.
