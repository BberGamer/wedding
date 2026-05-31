import Header1 from "../components/Header1";
import FrameComponent5 from "../components/FrameComponent5";
import FrameComponent6 from "../components/FrameComponent6";
import FrameComponent7 from "../components/FrameComponent7";
import FrameComponent8 from "../components/FrameComponent8";
import Component2 from "../components/Component2";
import FrameComponent9 from "../components/FrameComponent9";
import NewsContent1 from "../components/NewsContent1";
import ImageArticle1 from "../components/ImageArticle1";
import Box1 from "../components/Box1";
import Footer1 from "../components/Footer1";
import styles from "./WEDDING1.module.css";

const WEDDING1 = () => {
  return (
    <div className={styles.wedding}>
      <Header1 />
      <main className={styles.root}>
        <FrameComponent5
          lifeIsAnEvent="Life is an event"
          cngNhauToNnMtKNim="Cùng nhau tạo nên một kỷ niệm"
          chngTiYGipCcBnC="Chúng tôi ở đây để giúp các bạn có một lễ cưới trọn vẹn và dễ dàng nhất"
          frame1321317479="/Frame-1321317479@2x.png"
        />
        <FrameComponent6 />
        <FrameComponent7 />
        <FrameComponent8 />
        <Component2 />
        <FrameComponent5
          lifeIsAnEvent="Design . Plan . Love"
          cngNhauToNnMtKNim="trang điểm cô dâu"
          chngTiYGipCcBnC="Trải nghiệm dịch vụ chuyên nghiệp với mỹ phẩm cao cấp, đảm bảo lớp nền hoàn hảo suốt ngày dài. Hỗ trợ theo sát dặm phấn và thay đổi kiểu tóc linh hoạt, giúp cô dâu luôn là tâm điểm trong mọi khung hình"
          frame1321317479="/Frame-242@2x.png"
          frameSectionGap="20px"
          chngTiHeight="unset"
          frameIconHeight="723px"
          frameIconWidth="757px"
          categoryPath="/category/trang_diem"
        />
        <FrameComponent9 />
        <section className={styles.section}>
          <NewsContent1 />
          <ImageArticle1 />
          <Box1
            december082022="September 10, 2022"
            benefitsOfHiringTheBestEvent="Firework of emotions for any event you make"
            box3MarginTop="unset"
            groupDivWidth="unset"
            groupDivJustifyContent="unset"
            groupDivPadding="unset"
            groupDivGap="23.6px"
          />
        </section>
      </main>
      <Footer1 />
    </div>
  );
};

export default WEDDING1;
