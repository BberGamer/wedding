import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./ServiceDetailPage.module.css";
import { API_URL } from "../config";

const ServiceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activePhoto, setActivePhoto] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [reviewsList, setReviewsList] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const token = localStorage.getItem("token") || "";
  const user = (() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  })();

  const fetchReviews = () => {
    fetch(`${API_URL}/api/reviews?serviceId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải đánh giá");
        return res.json();
      })
      .then((data) => {
        setReviewsList(data);
      })
      .catch((err) => console.error("Lỗi khi tải đánh giá: ", err));
  };

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newContent.trim()) {
      setFormError("Vui lòng nhập nội dung nhận xét.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent,
          author: user?.name || user?.email || "Khách hàng",
          rating: newRating,
          serviceId: id,
          isHighlight: false
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFormSuccess("Cảm ơn bạn đã gửi đánh giá thành công!");
        setNewContent("");
        setNewRating(5);
        fetchReviews();

        setService(prev => {
          if (!prev) return prev;
          const newCount = (prev.reviewsCount || 0) + 1;
          const newAvgRating = parseFloat(
            (((prev.rating || 5) * (prev.reviewsCount || 0) + newRating) / newCount).toFixed(1)
          );
          return {
            ...prev,
            reviewsCount: newCount,
            rating: newAvgRating
          };
        });
      } else {
        setFormError(data.message || "Gửi đánh giá thất bại.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Lỗi kết nối đến máy chủ.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/services/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải thông tin dịch vụ");
        return res.json();
      })
      .then((data) => {
        setService(data);
        setActivePhoto(data.image || "");
        
        // Auto-select the first package by default
        if (data.pricingDetails && data.pricingDetails.length > 0) {
          setSelectedItems([data.pricingDetails[0]]);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Không tìm thấy dịch vụ yêu cầu.");
        setLoading(false);
      });
  }, [id]);

  // Recalculate price whenever selected items change
  useEffect(() => {
    const sum = selectedItems.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(sum);
  }, [selectedItems]);

  const handleCheckboxChange = (pkg) => {
    const isAlreadySelected = selectedItems.some((item) => item._id === pkg._id);
    if (isAlreadySelected) {
      // Must keep at least one package selected
      if (selectedItems.length === 1) return;
      setSelectedItems(selectedItems.filter((item) => item._id !== pkg._id));
    } else {
      setSelectedItems([...selectedItems, pkg]);
    }
  };

  const handlePayment = async () => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (!storedUser || !storedToken) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán dịch vụ!");
      navigate("/login", { state: { from: `/service/${id}` } });
      return;
    }

    if (totalPrice <= 0) {
      alert("Vui lòng chọn ít nhất một dịch vụ để thanh toán!");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/payments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({
          serviceId: service._id,
          items: selectedItems.map((item) => ({
            name: item.name,
            price: item.price,
            desc: item.desc,
          })),
          amount: totalPrice,
        }),
      });

      const orderData = await res.json();
      if (res.ok) {
        // Redirect to high-fidelity simulated VNPay Payment Page
        navigate(`/payment/vnpay`, {
          state: {
            txnRef: orderData.txnRef,
            amount: orderData.amount,
            serviceName: service.name,
            selectedPackages: selectedItems.map((item) => item.name).join(", "),
            serviceId: service._id,
          },
        });
      } else {
        alert(orderData.message || "Đặt dịch vụ thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      console.error("Order creation error: ", err);
      alert("Lỗi kết nối đến hệ thống máy chủ!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <SharedHeader />
        <div className={styles.spinnerSection}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin dịch vụ tiệc cưới...</p>
        </div>
        <Footer1 />
      </div>
    );
  }

  if (errorMsg || !service) {
    return (
      <div className={styles.errorWrapper}>
        <SharedHeader />
        <div className={styles.errorContainer}>
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginRight: 8, display: "inline-block", verticalAlign: "middle" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Có lỗi xảy ra
          </h2>
          <p>{errorMsg || "Không tìm thấy thông tin dịch vụ này."}</p>
          <Link to="/" className={styles.backHomeBtn}>Quay lại trang chủ</Link>
        </div>
        <Footer1 />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <SharedHeader />

      <main className={styles.mainContent}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/">Trang chủ</Link>
          <span className={styles.arrow}>/</span>
          <Link to={`/category/${service.category}`}>
            {service.category === "nha_hang" && "Nhà hàng"}
            {service.category === "trang_diem" && "Trang điểm cô dâu"}
            {service.category === "xe_hoa" && "Xe hoa cưới"}
            {service.category === "chup_anh" && "Chụp ảnh cưới"}
            {service.category === "vay_cuoi" && "Váy cưới thiết kế"}
          </Link>
          <span className={styles.arrow}>/</span>
          <span className={styles.current}>{service.name}</span>
        </div>

        {/* Head Intro */}
        <section className={styles.headIntro}>
          <div className={styles.headTitleBlock}>
            {service.badge && <span className={styles.badge}>{service.badge}</span>}
            <h1 className={styles.title}>{service.name}</h1>
            <div className={styles.ratingRow}>
              <span className={styles.star}>★</span>
              <span className={styles.ratingVal}>{service.rating}</span>
              <span className={styles.reviewsCount}>({service.reviewsCount} đánh giá khách hàng)</span>
            </div>
          </div>
          <div className={styles.priceEstimate}>
            <span className={styles.priceLabel}>GIÁ THAM KHẢO</span>
            <span className={styles.priceValue}>{service.priceLabel || formatPrice(service.price)}</span>
          </div>
        </section>

        {/* Photo Gallery & Album */}
        <section className={styles.gallerySection}>
          <div className={styles.largePhotoWrapper}>
            <img src={activePhoto} alt={service.name} className={styles.largePhoto} />
          </div>
          {service.album && service.album.length > 0 && (
            <div className={styles.thumbnailRow}>
              {service.album.map((photo, index) => (
                <div 
                  key={index} 
                  className={`${styles.thumbnailWrapper} ${activePhoto === photo ? styles.activeThumbnail : ""}`}
                  onClick={() => setActivePhoto(photo)}
                >
                  <img src={photo} alt={`${service.name} album ${index + 1}`} className={styles.thumbnail} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Main Grid Bố cục 2 cột */}
        <div className={styles.gridContainer}>
          {/* Cột trái: Thông tin chi tiết */}
          <div className={styles.leftColumn}>
            {/* Thẻ liên hệ nhanh */}
            <div className={styles.contactCard}>
              <h3 className={styles.sectionTitle}>Thông tin liên hệ</h3>
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Địa chỉ</span>
                    <span className={styles.value}>{service.address}</span>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Điện thoại</span>
                    <a href={`tel:${service.phone}`} className={styles.linkValue}>{service.phone}</a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Website</span>
                    <a href={service.website} target="_blank" rel="noopener noreferrer" className={styles.linkValue}>
                      {service.website.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.icon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <div>
                    <span className={styles.label}>Facebook</span>
                    <a href={service.facebook} target="_blank" rel="noopener noreferrer" className={styles.linkValue}>
                      {service.name} Official Facebook
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Vendor Card — Nhà cung cấp */}
            {service.vendor && (() => {
              // Check if vendor is populated object or raw ObjectId string
              const vendorId = typeof service.vendor === "object"
                ? (service.vendor._id || service.vendor.id)
                : service.vendor;
              const isPopulated = typeof service.vendor === "object" && service.vendor.name;

              return (
                <div className={styles.vendorCard}>
                  <h3 className={styles.sectionTitle}>Nhà Cung Cấp Dịch Vụ</h3>
                  <div className={styles.vendorCardInner}>
                    {isPopulated ? (
                      <>
                        <div className={styles.vendorCardLeft}>
                          {service.vendor.avatar ? (
                            <img
                              src={service.vendor.avatar}
                              alt={service.vendor.name}
                              className={styles.vendorAvatar}
                            />
                          ) : (
                            <div className={styles.vendorAvatarFallback}>
                              {service.vendor.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className={styles.vendorIdentity}>
                            <span className={styles.vendorRoleBadge}>NHÀ CUNG CẤP</span>
                            <strong className={styles.vendorName}>{service.vendor.name}</strong>
                            {service.vendor.email && (
                              <span className={styles.vendorEmail}>{service.vendor.email}</span>
                            )}
                          </div>
                        </div>

                        {service.vendor.description && (
                          <p className={styles.vendorDesc}>{service.vendor.description}</p>
                        )}

                        <div className={styles.vendorMeta}>
                          {service.vendor.phone && (
                            <a href={`tel:${service.vendor.phone}`} className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.35 2 2 0 0 1 3.59 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                              {service.vendor.phone}
                            </a>
                          )}
                          {service.vendor.address && (
                            <span className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                              </svg>
                              {service.vendor.address}
                            </span>
                          )}
                          {service.vendor.facebook && (
                            <a href={service.vendor.facebook} target="_blank" rel="noreferrer" className={styles.vendorMetaItem}>
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                              </svg>
                              Facebook
                            </a>
                          )}
                        </div>
                      </>
                    ) : (
                      <p style={{ fontSize: 13, color: "#787878", margin: 0 }}>
                        Thông tin nhà cung cấp sẽ hiển thị sau khi backend được restart để cập nhật dữ liệu mới.
                      </p>
                    )}

                    <Link
                      to={`/vendor/${vendorId}`}
                      className={styles.vendorProfileLink}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      Xem toàn bộ hồ sơ &amp; dịch vụ của nhà cung cấp
                    </Link>
                  </div>
                </div>
              );
            })()}


            {/* Chi tiết về dịch vụ */}

            <div className={styles.detailsCard}>
              <h3 className={styles.sectionTitle}>Mô tả chi tiết</h3>
              <p className={styles.descriptionText}>{service.description}</p>
            </div>

            {/* Dịch vụ đi kèm */}
            {service.includedServices && service.includedServices.length > 0 && (
              <div className={styles.includedCard}>
                <h3 className={styles.sectionTitle}>Dịch vụ đi kèm trọn gói</h3>
                <ul className={styles.includedList}>
                  {service.includedServices.map((inc, idx) => (
                    <li key={idx} className={styles.includedItem}>
                      <span className={styles.checkIcon}>✓</span>
                      <span className={styles.includedText}>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div className={styles.reviewsSectionCard}>
              <h3 className={styles.sectionTitle}>Đánh giá từ khách hàng ({reviewsList.length})</h3>
              
              {/* Reviews List */}
              {reviewsList.length === 0 ? (
                <p className={styles.noReviewsText}>Dịch vụ này chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận của bạn!</p>
              ) : (
                <div className={styles.reviewsList}>
                  {reviewsList.map((review) => (
                    <div key={review._id} className={styles.reviewItem}>
                      <div className={styles.reviewHeader}>
                        <span className={styles.reviewAuthor}>{review.author}</span>
                        <span className={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className={styles.reviewStars}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`${styles.reviewStar} ${
                              idx < (review.rating || 5) ? styles.starFilled : ""
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className={styles.reviewContent}>{review.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Review Submit Form */}
              <div className={styles.writeReviewBlock}>
                <h4 className={styles.writeReviewTitle}>Viết nhận xét & Đánh giá</h4>
                {token ? (
                  <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                    <div className={styles.ratingSelectGroup}>
                      <span className={styles.ratingSelectLabel}>Chọn số sao bình chọn:</span>
                      <div className={styles.starsSelector}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`${styles.starBtn} ${
                              (hoverRating || newRating) >= star ? styles.starFilled : ""
                            }`}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.commentInputGroup}>
                      <textarea
                        className={styles.commentTextarea}
                        placeholder="Chia sẻ trải nghiệm thực tế và đánh giá chất lượng của bạn về dịch vụ này..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        required
                      />
                    </div>
                    {formError && <p className={styles.formErrorText}>{formError}</p>}
                    {formSuccess && <p className={styles.formSuccessText}>{formSuccess}</p>}
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className={styles.submitReviewBtn}
                    >
                      {isSubmittingReview ? "Đang gửi..." : "GỬI ĐÁNH GIÁ CỦA BẠN"}
                    </button>
                  </form>
                ) : (
                  <div className={styles.loginPromptContainer}>
                    <p className={styles.loginPromptText}>
                      Vui lòng đăng nhập tài khoản để có thể đánh giá và nhận xét dịch vụ này.
                    </p>
                    <Link to="/login" state={{ from: `/service/${id}` }} className={styles.loginRedirectBtn}>
                      Đăng nhập ngay
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cột phải: Bảng giá, Chọn gói & Thanh toán */}
          <div className={styles.rightColumn}>
            <div className={styles.checkoutStickyCard}>
              <div className={styles.checkoutHeader}>
                <h3 className={styles.checkoutTitle}>Báo giá & Đặt dịch vụ</h3>
                <p className={styles.checkoutSub}>Lựa chọn gói tiệc và tính toán chi phí thực tế</p>
              </div>

              {/* Danh sách các gói */}
              <div className={styles.packageList}>
                {service.pricingDetails && service.pricingDetails.map((pkg) => {
                  const isChecked = selectedItems.some((item) => item._id === pkg._id);
                  return (
                    <div 
                      key={pkg._id} 
                      className={`${styles.packageCard} ${isChecked ? styles.packageCardSelected : ""}`}
                      onClick={() => handleCheckboxChange(pkg)}
                    >
                      <div className={styles.packageMainRow}>
                        <div className={styles.checkboxContainer}>
                          <input 
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // Handle on click div
                            className={styles.styledCheckbox}
                          />
                        </div>
                        <div className={styles.packageInfo}>
                          <h4 className={styles.packageName}>{pkg.name}</h4>
                          <span className={styles.packagePrice}>{formatPrice(pkg.price)}</span>
                        </div>
                      </div>
                      <p className={styles.packageDesc}>{pkg.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Tổng cộng */}
              <div className={styles.priceSummary}>
                <div className={styles.summaryRow}>
                  <span>Số lượng gói đã chọn:</span>
                  <span className={styles.summaryVal}>{selectedItems.length} gói</span>
                </div>
                <div className={styles.divider}></div>
                <div className={styles.totalRow}>
                  <span>TỔNG THANH TOÁN:</span>
                  <span className={styles.totalVal}>{formatPrice(totalPrice)}</span>
                </div>
              </div>

              {/* Nút thanh toán */}
              <button 
                type="button" 
                className={styles.payBtn}
                onClick={handlePayment}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className={styles.btnSpinner}></div>
                ) : (
                  <>
                    <img src="/vnpay-logo.svg" alt="" className={styles.vnpayIcon} onError={(e) => e.target.style.display="none"} />
                    <span>THANH TOÁN QUA VNPAY</span>
                  </>
                )}
              </button>
              <p className={styles.securePrompt}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Giao dịch được bảo mật và xử lý mô phỏng qua cổng VNPay chính thức.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer1 />
    </div>
  );
};

export default ServiceDetailPage;
