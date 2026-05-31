import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./UserReviews1.module.css";

const UserReviews1 = ({
  className = "",
  quTuytViThcSRtNgL,
  userReviewsPadding,
  userReviewsBackgroundColor,
  userReviewsJustifyContent,
  userReviewsHeight,
  userReviewsFlex,
  singleReviewWidth,
}) => {
  const userReviewsStyle = useMemo(() => {
    return {
      padding: userReviewsPadding,
      backgroundColor: userReviewsBackgroundColor,
      justifyContent: userReviewsJustifyContent,
      height: userReviewsHeight,
      flex: userReviewsFlex,
    };
  }, [
    userReviewsPadding,
    userReviewsBackgroundColor,
    userReviewsJustifyContent,
    userReviewsHeight,
    userReviewsFlex,
  ]);

  const singleReviewStyle = useMemo(() => {
    return {
      width: singleReviewWidth,
    };
  }, [singleReviewWidth]);

  return (
    <div
      className={[styles.userReviews, className].join(" ")}
      style={userReviewsStyle}
    >
      <div className={styles.singleReview} style={singleReviewStyle}>
        <div className={styles.reviewColumn}>
          <img className={styles.starSetIcon} alt="" src="/Star-Rating.svg" />
          <img className={styles.starSetIcon} alt="" src="/Star-Rating.svg" />
          <img className={styles.starSetIcon} alt="" src="/Star-Rating.svg" />
          <img className={styles.starSetIcon} alt="" src="/Star-Rating.svg" />
          <img className={styles.starSetIcon} alt="" src="/Star-Rating.svg" />
        </div>
        <h2 className={styles.quTuytVi}>{quTuytViThcSRtNgL}</h2>
      </div>
    </div>
  );
};

UserReviews1.propTypes = {
  className: PropTypes.string,
  quTuytViThcSRtNgL: PropTypes.string,

  /** Style props */
  userReviewsPadding: PropTypes.string,
  userReviewsBackgroundColor: PropTypes.string,
  userReviewsJustifyContent: PropTypes.string,
  userReviewsHeight: PropTypes.string,
  userReviewsFlex: PropTypes.string,
  singleReviewWidth: PropTypes.string,
};

export default UserReviews1;
