import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Box1.module.css";

const Box1 = ({
  className = "",
  december082022,
  benefitsOfHiringTheBestEvent,
  box3MarginTop,
  groupDivWidth,
  groupDivJustifyContent,
  groupDivPadding,
  groupDivGap,
}) => {
  const box3Style = useMemo(() => {
    return {
      marginTop: box3MarginTop,
    };
  }, [box3MarginTop]);

  const groupDivStyle = useMemo(() => {
    return {
      width: groupDivWidth,
      justifyContent: groupDivJustifyContent,
      padding: groupDivPadding,
      gap: groupDivGap,
    };
  }, [groupDivWidth, groupDivJustifyContent, groupDivPadding, groupDivGap]);

  return (
    <div className={[styles.box3, className].join(" ")} style={box3Style}>
      <div className={styles.december082022}>{december082022}</div>
      <div className={styles.benefitsOfHiringTheBestEvParent}>
        <h2 className={styles.benefitsOfHiring}>
          {benefitsOfHiringTheBestEvent}
        </h2>
        <div className={styles.readMoreParent} style={groupDivStyle}>
          <div className={styles.readMore}>read more</div>
          <div className={styles.pathStroke}>
            <img
              className={styles.pathStrokeIcon}
              alt=""
              src="/Path-Stroke.svg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Box1.propTypes = {
  className: PropTypes.string,
  december082022: PropTypes.string,
  benefitsOfHiringTheBestEvent: PropTypes.string,

  /** Style props */
  box3MarginTop: PropTypes.string,
  groupDivWidth: PropTypes.string,
  groupDivJustifyContent: PropTypes.string,
  groupDivPadding: PropTypes.string,
  groupDivGap: PropTypes.string,
};

export default Box1;
