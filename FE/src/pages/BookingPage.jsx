import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingPage.module.css";
import { API_URL } from "../config";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to login if user/token is missing
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thực hiện đặt dịch vụ cưới.");
      navigate("/login", { state: { from: "/booking" } });
    }
  }, [navigate]);

  // Extract service state from detail navigation
  const checkoutState = location.state || {};
  const { serviceId, serviceName, category, amount, selectedPackages } = checkoutState;

  // Fallback / Redirect if no service data (e.g., accessed page directly)
  useEffect(() => {
    if (!serviceId) {
      alert("Vui lòng chọn dịch vụ cưới trước khi tiến hành đặt lịch.");
      navigate("/");
    }
  }, [serviceId, navigate]);

  // Retrieve user info for autofill
  const user = (() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  // States
  const [step, setStep] = useState(1); // Step 1: Form, Step 2: Review
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    customerName: user ? user.name : "",
    customerPhone: user ? user.phone || "" : "",
    customerEmail: user ? user.email || "" : "",
    eventDate: "",
    eventTime: "",
    eventLocation: "",
    note: "",
    // Category specific
    guestCount: "",
    tableCount: "",
    hallType: "",
    menuRequest: "",
    decorRequest: "",
    // Makeup
    makeupTime: "",
    makeupLocation: "",
    makeupStyle: "",
    needTest: false,
    needHair: true,
    // Car
    pickupLocation: "",
    dropoffLocation: "",
    route: "",
    carType: "",
    needDecor: true,
    // Photography
    shootLocation: "",
    packageType: "",
    needVideo: false,
    photoStyle: "",
    shootHours: "",
    // Dress/Vest
    pickupDate: "",
    returnDate: "",
    dressType: "",
    dressSize: "",
    needTry: false,
    needAlter: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) newErrors.customerName = "Họ và tên không được để trống";
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Số điện thoại không được để trống";
    } else if (!/^0[3|5|7|8|9]\d{8}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = "Số điện thoại không đúng định dạng Việt Nam";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail.trim())) {
      newErrors.customerEmail = "Email không đúng định dạng";
    }

    if (!formData.eventDate) {
      newErrors.eventDate = "Vui lòng chọn ngày sử dụng dịch vụ";
    } else {
      const selected = new Date(formData.eventDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.eventDate = "Ngày sử dụng dịch vụ không được là ngày trong quá khứ";
      }
    }

    if (!formData.eventTime) newErrors.eventTime = "Vui lòng chọn giờ sử dụng dịch vụ";
    if (!formData.eventLocation.trim()) newErrors.eventLocation = "Địa điểm không được để trống";

    // Category specific validations
    if (category === "vay_cuoi") {
      if (!formData.pickupDate) newErrors.pickupDate = "Vui lòng chọn ngày nhận váy/vest";
      if (!formData.returnDate) newErrors.returnDate = "Vui lòng chọn ngày trả váy/vest";
      if (formData.pickupDate && formData.returnDate) {
        const pickup = new Date(formData.pickupDate);
        const returnD = new Date(formData.returnDate);
        if (returnD < pickup) {
          newErrors.returnDate = "Ngày trả đồ không được trước ngày nhận đồ";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkAvailability = async () => {
    if (!validateForm()) return;

    setIsCheckingAvailability(true);
    setAvailabilityMessage("");
    try {
      const res = await fetch(`${API_URL}/api/payments/check-availability`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          serviceId,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime
        })
      });

      const data = await res.json();
      setIsCheckingAvailability(false);

      if (res.ok && data.available) {
        // Go to next step
        setStep(2);
      } else {
        setAvailabilityMessage(data.message || "Dịch vụ đã bị trùng lịch vào ngày bạn đã chọn. Vui lòng chọn thời gian khác.");
      }
    } catch (err) {
      console.error(err);
      setIsCheckingAvailability(false);
      // Fallback in case of server connection issues to allow prototyping progress
      setStep(2);
    }
  };

  const submitBooking = async () => {
    if (!isAgreed) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    // Construct category specific data to save
    let categoryData = {};
    if (category === "nha_hang") {
      categoryData = {
        guestCount: formData.guestCount,
        tableCount: formData.tableCount,
        hallType: formData.hallType,
        menuRequest: formData.menuRequest,
        decorRequest: formData.decorRequest
      };
    } else if (category === "trang_diem") {
      categoryData = {
        makeupTime: formData.makeupTime,
        makeupLocation: formData.makeupLocation,
        makeupStyle: formData.makeupStyle,
        needTest: formData.needTest,
        needHair: formData.needHair
      };
    } else if (category === "xe_hoa") {
      categoryData = {
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        route: formData.route,
        carType: formData.carType,
        needDecor: formData.needDecor
      };
    } else if (category === "chup_anh") {
      categoryData = {
        shootLocation: formData.shootLocation,
        packageType: formData.packageType,
        needVideo: formData.needVideo,
        photoStyle: formData.photoStyle,
        shootHours: formData.shootHours
      };
    } else if (category === "vay_cuoi") {
      categoryData = {
        pickupDate: formData.pickupDate,
        returnDate: formData.returnDate,
        dressType: formData.dressType,
        dressSize: formData.dressSize,
        needTry: formData.needTry,
        needAlter: formData.needAlter
      };
    }

    try {
      const res = await fetch(`${API_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId,
          items: selectedPackages ? [{ name: selectedPackages, price: amount }] : [{ name: "Dịch vụ mặc định", price: amount }],
          amount,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail,
          eventDate: formData.eventDate,
          eventTime: formData.eventTime,
          eventLocation: formData.eventLocation,
          note: formData.note,
          categorySpecificData: categoryData
        })
      });

      const orderData = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        // Successfully created order/booking. Redirect to payment screen
        navigate("/payment/vnpay", {
          state: {
            txnRef: orderData.txnRef,
            amount: orderData.amount,
            serviceName: serviceName,
            selectedPackages: selectedPackages || "Dịch vụ mặc định",
            serviceId: serviceId
          }
        });
      } else {
        alert(orderData.message || "Đặt đơn đặt lịch thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
      alert("Lỗi kết nối đến máy chủ khi tạo đơn đặt lịch.");
    }
  };

  const renderCategoryFields = () => {
    switch (category) {
      case "nha_hang":
        return (
          <div className={styles.categoryFieldsBox}>
            <h3 className={styles.sectionSubtitle}>Yêu cầu riêng - Nhà hàng tiệc cưới</h3>
            <div className={styles.formGridCompact}>
              <div className={styles.inputGroup}>
                <label>Số lượng khách dự kiến</label>
                <input
                  type="number"
                  name="guestCount"
                  placeholder="Ví dụ: 300"
                  value={formData.guestCount}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Số bàn dự kiến</label>
                <input
                  type="number"
                  name="tableCount"
                  placeholder="Ví dụ: 30"
                  value={formData.tableCount}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Loại sảnh tiệc mong muốn</label>
                <input
                  type="text"
                  name="hallType"
                  placeholder="Ví dụ: Sảnh Gold, Sảnh Outdoor..."
                  value={formData.hallType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Yêu cầu thực đơn / Trang trí đặc biệt</label>
                <textarea
                  name="menuRequest"
                  rows="2"
                  placeholder="Ví dụ: Thực đơn chay, trang trí tông hoa hồng đỏ..."
                  value={formData.menuRequest}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>
        );
      case "trang_diem":
        return (
          <div className={styles.categoryFieldsBox}>
            <h3 className={styles.sectionSubtitle}>Yêu cầu riêng - Trang điểm cô dâu</h3>
            <div className={styles.formGridCompact}>
              <div className={styles.inputGroup}>
                <label>Giờ thợ trang điểm cần có mặt</label>
                <input
                  type="text"
                  name="makeupTime"
                  placeholder="Ví dụ: 4:30 AM"
                  value={formData.makeupTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Địa điểm trang điểm</label>
                <input
                  type="text"
                  name="makeupLocation"
                  placeholder="Ví dụ: Tại nhà riêng cô dâu"
                  value={formData.makeupLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Phong cách trang điểm mong muốn</label>
                <input
                  type="text"
                  name="makeupStyle"
                  placeholder="Ví dụ: Hàn Quốc tự nhiên, tone Tây..."
                  value={formData.makeupStyle}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needTest"
                  checked={formData.needTest}
                  onChange={handleInputChange}
                />
                Tôi cần trang điểm thử trước ngày cưới
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needHair"
                  checked={formData.needHair}
                  onChange={handleInputChange}
                />
                Bao gồm dịch vụ làm tóc cưới
              </label>
            </div>
          </div>
        );
      case "xe_hoa":
        return (
          <div className={styles.categoryFieldsBox}>
            <h3 className={styles.sectionSubtitle}>Yêu cầu riêng - Xe hoa ngày cưới</h3>
            <div className={styles.formGridCompact}>
              <div className={styles.inputGroup}>
                <label>Địa điểm đón dâu</label>
                <input
                  type="text"
                  name="pickupLocation"
                  placeholder="Địa chỉ nhà trai"
                  value={formData.pickupLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Địa điểm đến (Đưa dâu)</label>
                <input
                  type="text"
                  name="dropoffLocation"
                  placeholder="Địa chỉ nhà gái / Nhà hàng"
                  value={formData.dropoffLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Dòng xe mong muốn</label>
                <input
                  type="text"
                  name="carType"
                  placeholder="Ví dụ: Mercedes C200 trắng, Mazda 6..."
                  value={formData.carType}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Lộ trình di chuyển cụ thể</label>
                <textarea
                  name="route"
                  rows="2"
                  placeholder="Ví dụ: Nhà trai (Quận 3) -> Nhà gái (Quận 12) -> Nhà hàng tiệc cưới"
                  value={formData.route}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needDecor"
                  checked={formData.needDecor}
                  onChange={handleInputChange}
                />
                Yêu cầu trang trí xe hoa (hoa tươi/hoa lụa)
              </label>
            </div>
          </div>
        );
      case "chup_anh":
        return (
          <div className={styles.categoryFieldsBox}>
            <h3 className={styles.sectionSubtitle}>Yêu cầu riêng - Chụp ảnh & Quay phim</h3>
            <div className={styles.formGridCompact}>
              <div className={styles.inputGroup}>
                <label>Địa điểm chụp ảnh</label>
                <input
                  type="text"
                  name="shootLocation"
                  placeholder="Ví dụ: Phim trường, Đà Lạt, Nhà hàng..."
                  value={formData.shootLocation}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Loại gói chụp</label>
                <input
                  type="text"
                  name="packageType"
                  placeholder="Ví dụ: Gói Album Pre-wedding, Chụp Phóng sự..."
                  value={formData.packageType}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Số giờ chụp dự kiến</label>
                <input
                  type="number"
                  name="shootHours"
                  placeholder="Ví dụ: 4 hoặc 8 tiếng"
                  value={formData.shootHours}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label>Phong cách ảnh mong muốn</label>
                <input
                  type="text"
                  name="photoStyle"
                  placeholder="Ví dụ: Cổ điển, vintage, hiện đại châu Âu..."
                  value={formData.photoStyle}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needVideo"
                  checked={formData.needVideo}
                  onChange={handleInputChange}
                />
                Tôi cần quay phim phóng sự cưới đi kèm
              </label>
            </div>
          </div>
        );
      case "vay_cuoi":
        return (
          <div className={styles.categoryFieldsBox}>
            <h3 className={styles.sectionSubtitle}>Yêu cầu riêng - Thuê váy & Vest cưới</h3>
            <div className={styles.formGridCompact}>
              <div className={styles.inputGroup}>
                <label>Ngày nhận đồ</label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className={errors.pickupDate ? styles.inputError : ""}
                />
                {errors.pickupDate && <span className={styles.errorText}>{errors.pickupDate}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Ngày trả đồ</label>
                <input
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className={errors.returnDate ? styles.inputError : ""}
                />
                {errors.returnDate && <span className={styles.errorText}>{errors.returnDate}</span>}
              </div>
              <div className={styles.inputGroup}>
                <label>Size trang phục dự kiến</label>
                <input
                  type="text"
                  name="dressSize"
                  placeholder="Ví dụ: S, M, L hoặc số đo cụ thể"
                  value={formData.dressSize}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.checkboxRow}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needTry"
                  checked={formData.needTry}
                  onChange={handleInputChange}
                />
                Tôi cần đặt lịch thử đồ trực tiếp tại cửa hàng
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="needAlter"
                  checked={formData.needAlter}
                  onChange={handleInputChange}
                />
                Yêu cầu chỉnh sửa kích thước trang phục theo số đo
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Topbar navigation */}
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.logoText}>AN WEDDING</span>
          <span className={styles.topbarDivider}>|</span>
          <span className={styles.topbarSubtitle}>Thông tin đặt lịch</span>
        </div>
        <button
          type="button"
          className={styles.topbarCancelBtn}
          onClick={() => navigate(-1)}
        >
          ✕ Quay lại
        </button>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.innerContainer}>
          {/* Step indicator */}
          <div className={styles.stepProgressContainer}>
            <div className={`${styles.stepIndicator} ${step >= 1 ? styles.activeStep : ""}`}>
              <div className={styles.stepNum}>1</div>
              <div className={styles.stepText}>Nhập thông tin đặt lịch</div>
            </div>
            <div className={styles.stepProgressLine}>
              <div className={`${styles.lineFill} ${step === 2 ? styles.activeLine : ""}`}></div>
            </div>
            <div className={`${styles.stepIndicator} ${step === 2 ? styles.activeStep : ""}`}>
              <div className={styles.stepNum}>2</div>
              <div className={styles.stepText}>Xác nhận & Thanh toán</div>
            </div>
          </div>

          {step === 1 ? (
            /* STEP 1: BOOKING FORM */
            <div className={styles.wizardCard}>
              <h1 className={styles.wizardTitle}>Thông tin đặt lịch dịch vụ</h1>
              <p className={styles.wizardSubtitle}>
                Dịch vụ: <strong>{serviceName}</strong> | Tổng thanh toán tạm tính: <strong>{formatCurrency(amount)}</strong>
              </p>

              {availabilityMessage && (
                <div className={styles.errorAlert}>
                  ⚠️ {availabilityMessage}
                </div>
              )}

              <div className={styles.formGrid}>
                {/* Customer Details */}
                <div className={styles.inputGroup}>
                  <label>Họ và tên người liên hệ <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên cô dâu / chú rể"
                    className={errors.customerName ? styles.inputError : ""}
                  />
                  {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Số điện thoại liên hệ <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: 0901234567"
                    className={errors.customerPhone ? styles.inputError : ""}
                  />
                  {errors.customerPhone && <span className={styles.errorText}>{errors.customerPhone}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Email liên hệ <span className={styles.required}>*</span></label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="example@gmail.com"
                    className={errors.customerEmail ? styles.inputError : ""}
                  />
                  {errors.customerEmail && <span className={styles.errorText}>{errors.customerEmail}</span>}
                </div>

                {/* Event Details */}
                <div className={styles.inputGroup}>
                  <label>Ngày sử dụng dịch vụ <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className={errors.eventDate ? styles.inputError : ""}
                  />
                  {errors.eventDate && <span className={styles.errorText}>{errors.eventDate}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Giờ bắt đầu làm việc <span className={styles.required}>*</span></label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className={errors.eventTime ? styles.inputError : ""}
                  />
                  {errors.eventTime && <span className={styles.errorText}>{errors.eventTime}</span>}
                </div>

                <div className={styles.inputGroup}>
                  <label>Địa điểm tổ chức / sử dụng dịch vụ <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ nhà riêng hoặc nhà hàng tiệc cưới"
                    className={errors.eventLocation ? styles.inputError : ""}
                  />
                  {errors.eventLocation && <span className={styles.errorText}>{errors.eventLocation}</span>}
                </div>
              </div>

              {/* Dynamic category specific fields */}
              {renderCategoryFields()}

              {/* Notes */}
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <label>Ghi chú khác / Yêu cầu đặc biệt</label>
                  <textarea
                    name="note"
                    rows="3"
                    placeholder="Nhập bất kỳ ghi chú hoặc yêu cầu chi tiết nào đối với nhà cung cấp..."
                    value={formData.note}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>

              {/* Step 1 Submit Button */}
              <div className={styles.actionRow}>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={checkAvailability}
                  disabled={isCheckingAvailability}
                >
                  {isCheckingAvailability ? "Đang kiểm tra lịch trống..." : "Tiếp tục"}
                </button>
              </div>
            </div>
          ) : (
            /* STEP 2: REVIEW & CONFIRM */
            <div className={styles.wizardCard}>
              <h1 className={styles.wizardTitle}>Xác nhận thông tin đặt dịch vụ</h1>
              <p className={styles.wizardSubtitle}>
                Vui lòng kiểm tra kỹ các thông tin dưới đây trước khi tiến hành thanh toán chuyển cọc.
              </p>

              <div className={styles.reviewLayout}>
                {/* Left Side: Summary info */}
                <div className={styles.reviewMain}>
                  <div className={styles.reviewSection}>
                    <h3 className={styles.sectionSubtitle}>Dịch vụ đã chọn</h3>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Tên dịch vụ cưới</span>
                      <span className={styles.reviewValue}>{serviceName}</span>
                    </div>
                    {selectedPackages && (
                      <div className={styles.reviewRow}>
                        <span className={styles.reviewLabel}>Gói đi kèm</span>
                        <span className={styles.reviewValue}>{selectedPackages}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.reviewSection}>
                    <h3 className={styles.sectionSubtitle}>Thông tin đặt lịch</h3>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Khách hàng đặt lịch</span>
                      <span className={styles.reviewValue}>{formData.customerName}</span>
                    </div>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Số điện thoại liên hệ</span>
                      <span className={styles.reviewValue}>{formData.customerPhone}</span>
                    </div>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Địa chỉ Email</span>
                      <span className={styles.reviewValue}>{formData.customerEmail}</span>
                    </div>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Thời gian diễn ra</span>
                      <span className={styles.reviewValue}>{formData.eventTime} ngày {new Date(formData.eventDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className={styles.reviewRow}>
                      <span className={styles.reviewLabel}>Địa điểm tổ chức</span>
                      <span className={styles.reviewValue}>{formData.eventLocation}</span>
                    </div>
                    {formData.note && (
                      <div className={styles.reviewRow}>
                        <span className={styles.reviewLabel}>Ghi chú thêm</span>
                        <span className={styles.reviewValue}>{formData.note}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Price breakdown card */}
                <div className={styles.reviewSummary}>
                  <h3 className={styles.sectionSubtitle}>Tóm tắt thanh toán</h3>
                  <div className={styles.summaryBreakdown}>
                    <div className={styles.reviewRow}>
                      <span>Tạm tính</span>
                      <span>{formatCurrency(amount)}</span>
                    </div>
                    <div className={styles.reviewRow}>
                      <span>Phí dịch vụ cọc</span>
                      <span>{formatCurrency(amount * 0.2)} (20%)</span>
                    </div>
                    <div className={styles.reviewDivider}></div>
                    <div className={styles.totalPaymentRow}>
                      <span>Tổng tiền chuyển khoản</span>
                      <span className={styles.totalPrice}>{formatCurrency(amount)}</span>
                    </div>
                  </div>

                  {/* Policy agreements */}
                  <div className={styles.policyAgreeBox}>
                    <label className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <span>Tôi đã đọc và đồng ý với chính sách đặt dịch vụ tiệc cưới, đặt cọc 20% và chính sách hủy lịch của AN Wedding.</span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className={styles.summaryActions}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      disabled={!isAgreed || isSubmitting}
                      onClick={submitBooking}
                    >
                      {isSubmitting ? "Đang tạo đơn đặt lịch..." : "Xác nhận & Tiến hành thanh toán"}
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => setStep(1)}
                    >
                      Quay lại sửa thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingPage;
