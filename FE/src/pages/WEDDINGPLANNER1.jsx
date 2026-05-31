import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SharedHeader from "../components/SharedHeader";
import UserReviews1 from "../components/UserReviews1";
import styles from "./WEDDINGPLANNER1.module.css";
import { API_URL } from "../config";

const WEDDINGPLANNER1 = () => {
  const [userReviews1Items, setUserReviews1Items] = useState([]);

  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newContent, setNewContent] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = () => {
    fetch(`${API_URL}/api/reviews`)
      .then((res) => res.json())
      .then((data) => {
        const formattedReviews = data.map((item, index) => {
          if (index === 0) {
            return {
              quTuytViThcSRtNgL: item.content,
              userReviewsPadding: "44.5px 72px 44px",
              userReviewsBackgroundColor: "",
              userReviewsJustifyContent: "",
              userReviewsHeight: "189px",
              userReviewsFlex: "",
              singleReviewWidth: "",
            };
          } else if (index === 1) {
            return {
              quTuytViThcSRtNgL: item.content,
              userReviewsPadding: "44.5px 61px 44px",
              userReviewsBackgroundColor: "rgba(237, 227, 217, 0.5)",
              userReviewsJustifyContent: "flex-end",
              userReviewsHeight: "",
              userReviewsFlex: "",
              singleReviewWidth: "596px",
            };
          } else {
            return {
              quTuytViThcSRtNgL: item.content,
              userReviewsPadding: "44.5px 61px 44px",
              userReviewsBackgroundColor: "",
              userReviewsJustifyContent: "",
              userReviewsHeight: "unset",
              userReviewsFlex: 1,
              singleReviewWidth: "",
            };
          }
        });
        setUserReviews1Items(formattedReviews);
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!newContent.trim()) {
      setFormError("Vui lòng nhập nội dung đánh giá.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newContent,
          author: user?.name || user?.email || "Khách hàng",
          rating: newRating,
          isHighlight: false
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Không thể gửi đánh giá.");
      } else {
        setFormSuccess("Cảm ơn bạn đã gửi đánh giá thành công!");
        setNewContent("");
        setNewRating(5);
        fetchReviews();
      }
    } catch (err) {
      setFormError("Không thể kết nối đến server.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.weddingPlanner}>
      <div className={styles.header}>
        <img className={styles.icon} alt="" src="/03-1@2x.png" />
        <img
          className={styles.vectorIcon}
          loading="lazy"
          alt=""
          src="/Vector.svg"
        />
      </div>
      <main className={styles.frameParent}>
        <SharedHeader />
        <div className={styles.heroContentWrapper}>
          <div className={styles.heroContent}>
            <section className={styles.partnerContent}>
              <div className={styles.yourThirdWedding}>
                YOUR THIRD
                <br />
                WEDDING PARTNER
              </div>
              <div className={styles.rectangleParent}>
                <div className={styles.frameChild} />
                <img
                  className={styles.frameItem}
                  alt=""
                  src="/Frame-233@2x.png"
                />
                <img
                  className={styles.frameInner}
                  alt=""
                  src="/Frame-234@2x.png"
                />
                <img
                  className={styles.layer1Icon}
                  loading="lazy"
                  alt=""
                  src="/Layer-1.svg"
                />
              </div>
            </section>
            <section className={styles.weddingDetails}>
              <div className={styles.innerDescriptionParent}>
                <div className={styles.innerDescription}>
                  <div className={styles.innerContent}>
                    <img
                      className={styles.innerContentChild}
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
                    <h2 className={styles.discover}>DISCOVER</h2>
                    <div className={styles.buttonContainerInner}>
                      <div className={styles.vectorParent}>
                        <img
                          className={styles.vectorIcon2}
                          alt=""
                          src="/Vector1.svg"
                        />
                        <img
                          className={styles.ellipseIcon}
                          alt=""
                          src="/Ellipse-12.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className={styles.serviceDetailsWrapper}>
          <div className={styles.serviceDetails}>
            <section className={styles.frameContainer}>
              <div className={styles.thereIsSomeoneForEveryoneWrapper}>
                <div className={styles.thereIsSomeone}>
                  THERE IS SOMEONE FOR EVERYONE
                </div>
              </div>
              <div className={styles.serviceDescription}>
                <h1 className={styles.choMngN}>
                  CHÀO MỪNG ĐẾN VỚI DỊCH VỤ WEDDING PLANNER CỦA AN WEDDING
                </h1>
                <div className={styles.frameDiv}>
                  <img
                    className={styles.groupIcon}
                    alt=""
                    src="/Group-249@2x.png"
                  />
                  <div className={styles.ellipseDiv} />
                  <img
                    className={styles.vectorIcon3}
                    alt=""
                    src="/Vector1.svg"
                  />
                  <img
                    className={styles.frameChild2}
                    alt=""
                    src="/Group-248@2x.png"
                  />
                  <img
                    className={styles.frameChild3}
                    alt=""
                    src="/Group-248@2x.png"
                  />
                </div>
              </div>
            </section>
            <div className={styles.servicesOffered}>
              <div className={styles.frameParent2}>
                <section className={styles.frameSection}>
                  <div className={styles.beatrizPerezMoyaM2t1j6fn8wParent}>
                    <img
                      className={styles.beatrizPerezMoyaM2t1j6fn8wIcon}
                      loading="lazy"
                      alt=""
                      src="/beatriz-perez-moya-M2T1j-6Fn8w-unsplash@2x.png"
                    />
                    <div className={styles.contentContainer}>
                      <h2 className={styles.concept}>CONCEPT</h2>
                      <div className={styles.risusScelerisqueA2}>
                        Risus scelerisque a non turpis vitae malesuada sed
                        venenatis.
                      </div>
                    </div>
                  </div>
                </section>
                <section className={styles.kelseyCurtis8ezfg5oyhnyUnspParent}>
                  <img
                    className={styles.kelseyCurtis8ezfg5oyhnyUnspIcon}
                    alt=""
                    src="/kelsey-curtis-8ezfg5oYHNY-unsplash@2x.png"
                  />
                  <div className={styles.descriptionContainer}>
                    <div className={styles.descriptionBox}>
                      <h2 className={styles.concept}>TRỌN GÓI</h2>
                      <div className={styles.risusScelerisqueA2}>
                        Risus scelerisque a non turpis vitae malesuada sed
                        venenatis.
                      </div>
                    </div>
                  </div>
                </section>
                <section className={styles.frameSection}>
                  <div className={styles.jakobOwensMliurlmsrayUnsplaParent}>
                    <img
                      className={styles.jakobOwensMliurlmsrayUnsplaIcon}
                      alt=""
                      src="/jakob-owens-mLIurLmSRAY-unsplash@2x.png"
                    />
                    <div className={styles.frameWrapper3}>
                      <div className={styles.lCiParent}>
                        <h2 className={styles.concept}>LỄ CƯỚI</h2>
                        <div className={styles.risusScelerisqueA2}>
                          Risus scelerisque a non turpis vitae malesuada sed
                          venenatis.
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.engagementContent}>
          <div className={styles.theArtOfLoveFailitationParent}>
            <div className={styles.theArtOf}>THE ART OF LOVE FAILITATION</div>
            <div className={styles.inspirationContent}>
              <div className={styles.highlightDetailsParent}>
                <img
                  className={styles.highlightDetailsIcon}
                  alt=""
                  src="/Highlight-Details@2x.png"
                />
                <div className={styles.layer1Parent}>
                  <img
                    className={styles.layer1Icon2}
                    alt=""
                    src="/Layer-1.svg"
                  />
                  <div className={styles.frameChild4} />
                </div>
              </div>
              <h1
                className={styles.infiniteEternal}
              >{`INFINITE & ETERNAL LOVE`}</h1>
            </div>
          </div>
          <div className={styles.candleImagesRow}>
            <img
              className={styles.candleImage}
              loading="lazy"
              alt=""
              src="/Content-Elements@2x.png"
            />
            <img
              className={styles.candleImage}
              loading="lazy"
              alt=""
              src="/Content-Elements@2x.png"
            />
            <img
              className={styles.candleImage}
              loading="lazy"
              alt=""
              src="/Content-Elements@2x.png"
            />
            <img
              className={styles.candleImage}
              loading="lazy"
              alt=""
              src="/Content-Elements@2x.png"
            />
          </div>
          <section className={styles.engagementContentInner}>
            <div className={styles.groupDiv}>
              <div className={styles.frameWrapper4}>
                <div className={styles.containerSpacerParent}>
                  <h2 className={styles.containerSpacer}>459</h2>
                  <div className={styles.categoryDivisions}>
                    <div className={styles.nghiL}>NGHI LỄ</div>
                  </div>
                </div>
              </div>
              <div className={styles.frameWrapper5}>
                <div className={styles.containerSpacerParent}>
                  <h2 className={styles.containerSpacer}>459</h2>
                  <div className={styles.categoryDivisions}>
                    <div className={styles.cpI}>CẶP ĐÔI</div>
                  </div>
                </div>
              </div>
              <div className={styles.priceLabelParent}>
                <h2 className={styles.containerSpacer}>459</h2>
                <div className={styles.bnhCiWrapper}>
                  <div className={styles.cpI}>BÁNH CƯỚI</div>
                </div>
              </div>
              <div className={styles.frameParent3}>
                <div className={styles.emptyLabelWrapper}>
                  <h2 className={styles.emptyLabel}>459</h2>
                </div>
                <div className={styles.trangTr}>Đồ trang trí</div>
              </div>
            </div>
          </section>
          <img className={styles.vectorIcon4} alt="" src="/Vector1.svg" />
        </div>

        <img
          className={styles.inspirationPaddingIcon}
          loading="lazy"
          alt=""
          src="/Inspiration-Padding@2x.png"
        />
      </main>
      <section className={styles.testimonialsSliderWrapper}>
        <div className={styles.testimonialsSlider}>
          <div className={styles.testimonialContent}>
            <div className={styles.testimonialSlide}>
              <section className={styles.testimonialCarousel}>
                <div className={styles.testimonialBlock}>
                  <img
                    className={styles.testimonialBlockChild}
                    loading="lazy"
                    alt=""
                    src="/Frame-261@2x.png"
                  />
                </div>
                <div className={styles.dchVHonHoVtNgoiMoParent}>
                  <h1 className={styles.dchVHon}>
                    "Dịch vụ hoàn hảo vượt ngoài mong đợi"
                  </h1>
                  <div className={styles.haiVChng}>
                    "Hai vợ chồng mình đã tiết kiệm được rất nhiều thời gian nhờ
                    có nền tảng này. Từ khâu so sánh giá sảnh, tìm váy cưới đến
                    lúc chốt thực đơn đều cực kỳ mượt mà. 10 điểm không có
                    nhưng!"
                  </div>
                  <div className={styles.reviewStars}>
                    <img
                      className={styles.starRatingIcon}
                      alt=""
                      src="/Star-Rating.svg"
                    />
                    <img
                      className={styles.starRatingIcon}
                      alt=""
                      src="/Star-Rating.svg"
                    />
                    <img
                      className={styles.starRatingIcon}
                      alt=""
                      src="/Star-Rating.svg"
                    />
                    <img
                      className={styles.starRatingIcon}
                      alt=""
                      src="/Star-Rating.svg"
                    />
                    <img
                      className={styles.starRatingIcon}
                      alt=""
                      src="/Star-Rating.svg"
                    />
                  </div>
                  <h2 className={styles.khnhLinh}>Khánh Linh</h2>
                </div>
              </section>
              <section className={styles.excellentReview}>
                {userReviews1Items.map((item, index) => (
                  <UserReviews1
                    key={index}
                    quTuytViThcSRtNgL={item.quTuytViThcSRtNgL}
                    userReviewsPadding={item.userReviewsPadding}
                    userReviewsBackgroundColor={item.userReviewsBackgroundColor}
                    userReviewsJustifyContent={item.userReviewsJustifyContent}
                    userReviewsHeight={item.userReviewsHeight}
                    userReviewsFlex={item.userReviewsFlex}
                    singleReviewWidth={item.singleReviewWidth}
                  />
                ))}
              </section>
            </div>
          </div>

          <div className={styles.reviewFormSection}>
            <h3 className={styles.writeReviewTitle}>Đánh giá và nhận xét của bạn</h3>
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
                    placeholder="Chia sẻ nhận xét của bạn về chất lượng dịch vụ của AN Wedding..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                  />
                </div>
                {formError && <p className={styles.formErrorText}>{formError}</p>}
                {formSuccess && <p className={styles.formSuccessText}>{formSuccess}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitReviewBtn}
                >
                  {isSubmitting ? "Đang gửi đánh giá..." : "GỬI ĐÁNH GIÁ NGAY"}
                </button>
              </form>
            ) : (
              <div className={styles.loginPromptContainer}>
                <p className={styles.loginPromptText}>
                  Bạn cần đăng nhập để gửi đánh giá và chia sẻ trải nghiệm về dịch vụ cưới.
                </p>
                <Link to="/login" className={styles.loginRedirectBtn}>
                  Đăng nhập ngay
                </Link>
              </div>
            )}
          </div>

          <div className={styles.seeMemories}>
            <div className={styles.nghiL}>SEE ALL THE MEMORIES ON CLOUD</div>
          </div>
          <div className={styles.hnLCa}>
            "HÔN LỄ CỦA BẠN LÀ
            <br />
            CÂU CHUYỆN CỔ TÍCH ĐỜI THỰC""
          </div>
        </div>
      </section>
      <section className={styles.shareExperts}>
        <div className={styles.ngNgiChia}>ĐỪNG NGẠI CHIA SẺ VỚI CHÚNG TÔI</div>
        <section className={styles.expertChat}>
          <h2 className={styles.trChuynCng}>TRÒ CHUYỆN CÙNG CHUYÊN GIA CƯỚI</h2>
          <div className={styles.contactColumn}>
            <div className={styles.inputFields}>
              <div className={styles.inputLabel}>
                <div className={styles.labelPair}>
                  <input
                    className={styles.yourEmailAddress}
                    placeholder="Your Email Address"
                    type="text"
                  />
                  <img
                    className={styles.labelPairChild}
                    alt=""
                    src="/Vector-37.svg"
                  />
                </div>
                <div className={styles.labelPair}>
                  <input
                    className={styles.yourName}
                    placeholder="Your Name"
                    type="text"
                  />
                  <img
                    className={styles.labelPairChild}
                    alt=""
                    src="/Vector-37.svg"
                  />
                </div>
              </div>
              <div className={styles.messageBoxWrapper}>
                <div className={styles.messageBox}>
                  <div className={styles.message}>Message</div>
                  <img
                    className={styles.labelPairChild}
                    alt=""
                    src="/Vector-37.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className={styles.getAdvice}>
          <div className={styles.consultationButton}>
            <h2 className={styles.nhnTVn}>NHẬN TƯ VẤN NGAY</h2>
            <div className={styles.consultationButtonInner}>
              <div className={styles.vectorParent}>
                <img className={styles.vectorIcon5} alt="" src="/Vector1.svg" />
                <img
                  className={styles.ellipseIcon}
                  alt=""
                  src="/Ellipse-12.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerLogo}>
          <img className={styles.logoAreaIcon} alt="" src="/Logo-Area@2x.png" />
          <div className={styles.brandCircle} />
          <img className={styles.vectorIcon6} alt="" src="/Vector1.svg" />
          <img className={styles.layer1Icon3} alt="" src="/Layer-1.svg" />
        </div>
      </section>
      <footer className={styles.footer}>
        <div className={styles.titleParent}>
          <h1 className={styles.title}>
            Our wedding planners will leave you breathless on your special day.
          </h1>
          <div className={styles.copyrightDetails}>
            <div className={styles.copyright2020LaaParent}>
              <div className={styles.termsOfUse}>
                Copyright Dotcreativemarket
              </div>
              <div className={styles.legalLinks}>
                <div className={styles.termsOfUse}>Terms of Use</div>
                <div className={styles.termsOfUse}>Privacy Policy</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.sitemap}>
            <h3 className={styles.sitemap2}>Sitemap</h3>
            <div className={styles.pageLinks}>
              <div className={styles.termsOfUse}>Home</div>
              <div className={styles.termsOfUse}>About</div>
              <div className={styles.termsOfUse}>Services</div>
              <div className={styles.termsOfUse}>Blog</div>
              <div className={styles.events}>Events</div>
              <div className={styles.termsOfUse}>Contact Us</div>
            </div>
          </div>
          <div className={styles.newsletter}>
            <h3 className={styles.newsletter2}>newsletter</h3>
            <div className={styles.emailForm}>
              <div className={styles.enterYouEmailAddressParent}>
                <div className={styles.enterYouEmail}>
                  enter you email address
                </div>
                <input
                  className={styles.subscribeAction}
                  placeholder="subscribe"
                  type="text"
                />
              </div>
              <div className={styles.emailDivider} />
            </div>
            <img
              className={styles.pathStrokeIcon}
              loading="lazy"
              alt=""
              src="/Path-Stroke.svg"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WEDDINGPLANNER1;
