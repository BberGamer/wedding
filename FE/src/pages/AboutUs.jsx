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
            <span className={styles.eyebrow}>GIOI THIEU VE AN WEDDING</span>
            <h1 className={styles.heroTitle}>Hanh Trinh Kien Tao Hanh Phuc</h1>
            <p className={styles.heroSubtitle}>
              Chao mung ban den voi AN Wedding - Nen tang ket noi dich vu cuoi cao cap, noi nhung y tuong lang man nhat duoc thap sang thanh hien thuc tron ven va an tam tuyet doi.
            </p>
          </div>
        </section>

        {/* Narrative Section - The Story */}
        <section className={styles.narrativeSection}>
          <div className={styles.narrativeGrid}>
            <div className={styles.narrativeText}>
              <span className={styles.sectionLabel}>CAU CHUYEN CUA CHUNG TOI</span>
              <h2 className={styles.sectionTitle}>Su menh ton vinh ngay chung doi</h2>
              <p className={styles.paragraph}>
                Duoc thanh lap voi khat vong don gian hoa hanh trinh chuan bi cuoi day lo toan, <strong>AN Wedding</strong> dong vai tro la chiec cau noi nghe thuat giua cac cap doi va nhung nha cung cap dich vu cuoi hang dau tai Viet Nam.
              </p>
              <p className={styles.paragraph}>
                Chung toi hieu rang, moi dam cuoi la mot cau chuyen tinh yeu doc ban. Khong chi dung lai o viec tim kiem dia diem hay trang diem, AN Wedding mang den mot he sinh thai thong minh giup ban hoach dinh, so sanh bao gia chi tiet va hien thuc hoa dam cuoi trong mo mot cach sang trong, tinh te nhat.
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
            <span className={styles.sectionLabel}>GIA TRI COT LOI</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>Ba tru cot tao nen su khac biet</h2>
          </div>

          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Tinh Te &amp; Doc Ban</h3>
              <p className={styles.valueText}>
                Tung nha hang, chuyen vien trang diem, xe hoa hay bo vay cuoi tren AN Wedding deu duoc tuyen chon khat khe de dam bao phong cach luxury va ton vinh ca tinh rieng biet cua co dau chu re.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Tin Cay Tuyet Doi</h3>
              <p className={styles.valueText}>
                He thong bao ve giao dich thong qua Admin kiem duyet va tich hop Webhook thong minh SePay bao chung 100% dong tien cua ban luon an toan truoc khi dich vu duoc hoan thanh.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3 className={styles.valueTitle}>Ket Noi Lien Mach</h3>
              <p className={styles.valueText}>
                Xoa bo rao can thong tin giua cac cap doi va nha cung cap. Moi goi dich vu, chinh sach gia, tien ich di kem deu hien thi minh bach giup tiet kiem toi da thoi gian chuan bi dam cuoi.
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
              <span className={styles.sectionLabel}>CONG NGHE BAO MAT GIAO DICH</span>
              <h2 className={styles.sectionTitle}>Giai phap thanh toan SePay VietQR dot pha</h2>
              <p className={styles.paragraph}>
                Tai AN Wedding, chung toi tien phong ung dung cong nghe bao chung giao dich 3 ben. Thay vi thanh toan truc tiep cho nha cung cap va doi mat voi rui ro dich vu khong nhu y, moi khoan thanh toan tu cap doi se duoc chuyen truc tiep vao tai khoan an toan cua Platform Owner (Admin).
              </p>
              <p className={styles.paragraph}>
                Nho vao ket noi <strong>Webhook SePay tu dong hien thi don hang thanh cong trong 2 giay</strong>, he thong se xac nhan dat cho lap tuc. Khoan tien chi duoc giai ngan cho doi tac cung cap dich vu sau khi ngay vui cua hai ban hoan tat tot dep va co xac nhan kiem duyet chat luong tu Admin.
              </p>
            </div>
          </div>
        </section>

        {/* Team / Founders Section */}
        <section className={styles.teamSection}>
          <div className={styles.valuesHeader}>
            <span className={styles.sectionLabel}>DOI NGU SANG LAP</span>
            <h2 className={styles.sectionTitle} style={{ textAlign: "center" }}>Nhung nguoi dong hanh cung ban</h2>
          </div>

          {/* Row 1: top 3 */}
          <div className={styles.teamRow}>
            {/* CEO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/chu-duc-doanh.png"
                  alt="Chu Duc Doanh - CEO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Chu Duc Doanh</h3>
              <p className={styles.teamRole}>CEO</p>
              <p className={styles.teamDesc}>
                Phu trach chien luoc tong the, tam nhin, hop tac doi tac va la dai dien phap luat.
              </p>
            </div>

            {/* COO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/nguyen-thi-hong-nhung.png"
                  alt="Nguyen Thi Hong Nhung - COO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Nguyen Thi Hong Nhung</h3>
              <p className={styles.teamRole}>COO</p>
              <p className={styles.teamDesc}>
                Chi dao sang tao ve nhan dien hinh anh, noi dung truyen thong. Lam content quang cao (video, hinh anh, bai viet) cho cac chien dich Marketing.
              </p>
            </div>

            {/* CTO */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/do-van-binh.png"
                  alt="Do Van Binh - CTO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Do Van Binh</h3>
              <p className={styles.teamRole}>CTO</p>
              <p className={styles.teamDesc}>
                Chi dao sang tao ve nhan dien hinh anh, noi dung truyen thong. Lam content quang cao (video, hinh anh, bai viet) cho cac chien dich Marketing.
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
                  alt="Dinh Quang Huy - CFO, CMO"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Dinh Quang Huy</h3>
              <p className={styles.teamRole}>CFO, CMO</p>
              <p className={styles.teamDesc}>
                Quan ly ngan sach, dong tien, rui ro tai chinh va lam viec voi cac nha dau tu, chiu trach nhiem chien luoc thu hut nguoi dung va phat trien thuong hieu. Xay dung cac chien dich truyen thong.
              </p>
            </div>

            {/* Marketing */}
            <div className={styles.teamCard}>
              <div className={styles.teamImageWrapper}>
                <img
                  src="/team/dam-phuong-thao.png"
                  alt="Dam Phuong Thao - Marketing"
                  className={styles.teamImage}
                />
              </div>
              <h3 className={styles.teamName}>Dam Phuong Thao</h3>
              <p className={styles.teamRole}>Marketing</p>
              <p className={styles.teamDesc}>
                Phu trach toan bo hoat dong marketing, xay dung thuong hieu va trien khai cac chien dich truyen thong cho AN Wedding.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Banner */}
        <section className={styles.contactBanner}>
          <div className={styles.contactBannerContent}>
            <h2>Dong hanh cung hai ban viet tiep cau chuyen tinh yeu</h2>
            <p>Neu ban co bat cu thac mac nao, doi ngu tu van vien cua chung toi luon san sang ho tro truc tuyen 24/7.</p>
            <div className={styles.contactNumber}>contact: 0337774204</div>
          </div>
        </section>
      </main>

      <Footer1 />
    </div>
  );
};

export default AboutUs;
