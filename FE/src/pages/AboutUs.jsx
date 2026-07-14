import { useEffect } from "react";
import SharedHeader from "../components/SharedHeader";
import Footer1 from "../components/Footer1";
import styles from "./AboutUs.module.css";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.aboutPage}>
      <SharedHeader theme="light" />

      {/* Decorative patterns */}
      <div className={styles.bgCircle1} />
      <div className={styles.bgCircle2} />
      <img className={styles.bgLeaf} alt="" src="/Layer-1.svg" />

      <main className={styles.container}>
        {/* Banner Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>GIỚI THIỆU VỀ AN WEDDING</span>
            <h1 className={styles.heroTitle}>Hành Trình Kiến Tạo Hạnh Phúc</h1>
            <p className={styles.heroSubtitle}>
              Chào mừng bạn đến với AN Wedding - Nền tảng kết nối dịch vụ cưới cao cấp, nơi những ý tưởng lãng mạn nhất được thắp sáng thành hiện thực trọn vẹn và an tâm tuyệt đối.
            </p>
          </div>
        </section>

        {/* Narrative Section - The Story */}
        <section className={styles.narrativeSection}>
          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeText}>
              <span className={styles.sectionLabel}>CÂU CHUYỆN CỦA CHÚNG TÔI</span>
              <h2 className={styles.sectionTitle}>Sứ mệnh tôn vinh ngày chung đôi</h2>
              <p className={styles.paragraph}>
                Được thành lập với khát vọng đơn giản hóa hành trình chuẩn bị cưới đầy lo toan, <strong>AN Wedding</strong> đóng vai trò là chiếc cầu nối nghệ thuật giữa các cặp đôi và những nhà cung cấp dịch vụ cưới hàng đầu tại Việt Nam.
              </p>
              <p className={styles.paragraph}>
                Chúng tôi hiểu rằng, mỗi đám cưới là một câu chuyện tình yêu độc bản. Không chỉ dừng lại ở việc tìm kiếm địa điểm hay trang điểm, AN Wedding mang đến một hệ sinh thái thông minh giúp bạn hoạch định, so sánh báo giá chi tiết và hiện thực hóa đám cưới trong mơ một cách sang trọng, tinh tế nhất.
              </p>
            </div>
            <div className={styles.narrativeImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
                alt="AN Wedding Story"
                className={styles.narrativeImage}
              />
              <div className={styles.imageOutlineFrame} />
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className={styles.valuesSection}>
          <div className={styles.valuesHeader}>
            <span className={styles.sectionLabel}>GIÁ TRỊ CỐT LÕI</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>Ba trụ cột tạo nên sự khác biệt</h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Tinh Tế &amp; Độc Bản</h3>
              <p className={styles.valueText}>
                Từng nhà hàng, chuyên viên trang điểm, xe hoa hay bộ váy cưới trên AN Wedding đều được tuyển chọn khắt khe để đảm bảo phong cách luxury và tôn vinh cá tính riêng biệt của cô dâu chú rể.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Tin Cậy Tuyệt Đối</h3>
              <p className={styles.valueText}>
                Hệ thống bảo vệ giao dịch thông qua Admin kiểm duyệt và tích hợp Webhook thông minh SePay bảo chứng 100% dòng tiền của bạn luôn an toàn trước khi dịch vụ được hoàn thành.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Kết Nối Liền Mạch</h3>
              <p className={styles.valueText}>
                Xóa bỏ rào cản thông tin giữa các cặp đôi và nhà cung cấp. Mọi gói dịch vụ, chính sách giá, tiện ích đi kèm đều hiển thị minh bạch giúp tiết kiệm tối đa thời gian chuẩn bị đám cưới.
              </p>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className={styles.securitySection}>
          <div className={styles.securityGrid}>
            <div className={styles.securityImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800"
                alt="Secure payment wedding services"
                className={styles.securityImage}
              />
              <div className={styles.imageOutlineFrameLeft} />
            </div>

            <div className={styles.securityText}>
              <span className={styles.sectionLabel}>CÔNG NGHỆ BẢO MẬT GIAO DỊCH</span>
              <h2 className={styles.sectionTitle}>Giải pháp thanh toán SePay VietQR đột phá</h2>
              <p className={styles.paragraph}>
                Tại AN Wedding, chúng tôi tiên phong ứng dụng công nghệ bảo chứng giao dịch 3 bên. Thay vì thanh toán trực tiếp cho nhà cung cấp và đối mặt với rủi ro dịch vụ không như ý, mọi khoản thanh toán từ cặp đôi sẽ được chuyển trực tiếp vào tài khoản an toàn của Platform Owner (Admin).
              </p>
              <p className={styles.paragraph}>
                Nhờ vào kết nối <strong>Webhook SePay tự động hiển thị đơn hàng thành công trong 2 giây</strong>, hệ thống sẽ xác nhận đặt chỗ lập tức. Khoản tiền chỉ được giải ngân cho đối tác cung cấp dịch vụ sau khi ngày vui của hai bạn hoàn tất tốt đẹp và có xác nhận kiểm duyệt chất lượng từ Admin.
              </p>
            </div>
          </div>
        </section>

        {/* Team / Founders Section */}
        <section className={styles.teamSection}>
          <div className={styles.valuesHeader}>
            <span className={styles.sectionLabel}>ĐỘI NGŨ SÁNG LẬP</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>Những người đồng hành cùng bạn</h2>
          </div>

          {/* Row 1: top 3 */}
          <div className={styles.teamRow}>
            {/* CEO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/chu-duc-doanh.jpg"
                  alt="Chu Đức Doanh - CEO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Chu Đức Doanh</h3>
              <p className={styles.teamRole}>CEO</p>
              <p className={styles.teamDesc}>
                Phụ trách chiến lược tổng thể, tầm nhìn, hợp tác đối tác và là đại diện pháp luật.
              </p>
            </div>

            {/* COO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/nguyen-thi-hong-nhung.png"
                  alt="Nguyễn Thị Hồng Nhung - COO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Nguyễn Thị Hồng Nhung</h3>
              <p className={styles.teamRole}>COO</p>
              <p className={styles.teamDesc}>
                Chỉ đạo sáng tạo về nhận diện hình ảnh, nội dung truyền thông. Làm content quảng cáo (video, hình ảnh, bài viết) cho các chiến dịch Marketing.
              </p>
            </div>

            {/* CTO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/do-van-binh.png"
                  alt="Đỗ Văn Bình - CTO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Đỗ Văn Bình</h3>
              <p className={styles.teamRole}>CTO</p>
              <p className={styles.teamDesc}>
                Giám đốc Công nghệ, vị trí quản lý cấp cao chịu trách nhiệm dẫn dắt chiến lược công nghệ, nghiên cứu & phát triển (R&D), và tối ưu hóa hệ thống kỹ thuật
              </p>
            </div>
          </div>

          {/* Row 2: bottom 2 */}
          <div className={styles.teamRow}>
            {/* CFO + CMO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/dinh-quang-huy.png"
                  alt="Đinh Quang Huy - CFO, CMO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Đinh Quang Huy</h3>
              <p className={styles.teamRole}>CFO, CMO</p>
              <p className={styles.teamDesc}>
                Quản lý ngân sách, dòng tiền, rủi ro tài chính và làm việc với các nhà đầu tư, chịu trách nhiệm chiến lược thu hút người dùng và phát triển thương hiệu. Xây dựng các chiến dịch truyền thông.
              </p>
            </div>

            {/* Marketing */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/dam-phuong-thao.png"
                  alt="Đàm Phương Thảo - Marketing"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Đàm Phương Thảo</h3>
              <p className={styles.teamRole}>Marketing</p>
              <p className={styles.teamDesc}>
                Phụ trách toàn bộ hoạt động marketing, xây dựng thương hiệu và triển khai các chiến dịch truyền thông cho AN Wedding.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Banner */}
        <section className={styles.contactBanner}>
          <div className={styles.contactBannerContent}>
            <h2>Đồng hành cùng hai bạn viết tiếp câu chuyện tình yêu</h2>
            <p>Nếu bạn có bất cứ thắc mắc nào, đội ngũ tư vấn viên của chúng tôi luôn sẵn sàng hỗ trợ trực tuyến 24/7.</p>
            <div className={styles.contactNumber}>contact: 0337774204</div>
          </div>
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default AboutUs;
