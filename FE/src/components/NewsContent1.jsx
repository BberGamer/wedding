import Text2 from "./Text2";
import PropTypes from "prop-types";
import styles from "./NewsContent1.module.css";

const NewsContent1 = ({ className = "" }) => {
  return (
    <section className={[styles.newsContent, className].join(" ")}>
      <div className={styles.newsBlog}>{`News& blog `}</div>
      <div className={styles.thipCiParent}>
        <h2 className={styles.thipCi}>thiệp cưới</h2>
        <div className={styles.articleAction}>
          <Text2
            button="Xem tất cả"
            textPadding="17px 40.3px 15px 40.7px"
            textWidth="167px"
            buttonBackgroundHeight="calc(100% + 1px)"
            buttonBackgroundWidth="calc(100% + 1px)"
            buttonBackgroundTop="0px"
            buttonBackgroundRight="-1px"
            buttonBackgroundBottom="-1px"
            buttonBackgroundLeft="0px"
            buttonWidth="86px"
          />
        </div>
      </div>
    </section>
  );
};

NewsContent1.propTypes = {
  className: PropTypes.string,
};

export default NewsContent1;
