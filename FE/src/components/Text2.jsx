import { useMemo } from "react";
import PropTypes from "prop-types";
import styles from "./Text2.module.css";

const Text2 = ({
  className = "",
  button,
  onClick,
  textPadding,
  textWidth,
  buttonBackgroundHeight,
  buttonBackgroundWidth,
  buttonBackgroundTop,
  buttonBackgroundRight,
  buttonBackgroundBottom,
  buttonBackgroundLeft,
  buttonWidth,
}) => {
  const textStyle = useMemo(() => {
    return {
      padding: textPadding,
      width: textWidth,
    };
  }, [textPadding, textWidth]);

  const buttonBackgroundStyle = useMemo(() => {
    return {
      height: buttonBackgroundHeight,
      width: buttonBackgroundWidth,
      top: buttonBackgroundTop,
      right: buttonBackgroundRight,
      bottom: buttonBackgroundBottom,
      left: buttonBackgroundLeft,
    };
  }, [
    buttonBackgroundHeight,
    buttonBackgroundWidth,
    buttonBackgroundTop,
    buttonBackgroundRight,
    buttonBackgroundBottom,
    buttonBackgroundLeft,
  ]);

  const buttonStyle = useMemo(() => {
    return {
      width: buttonWidth,
    };
  }, [buttonWidth]);

  return (
    <button
      className={[styles.lightbuttonsecondarytext, className].join(" ")}
      style={textStyle}
      onClick={onClick}
    >
      <div className={styles.buttonBackground} style={buttonBackgroundStyle} />
      <div className={styles.button} style={buttonStyle}>
        {button}
      </div>
    </button>
  );
};

Text2.propTypes = {
  className: PropTypes.string,
  button: PropTypes.string,
  onClick: PropTypes.func,

  /** Style props */
  textPadding: PropTypes.string,
  textWidth: PropTypes.string,
  buttonBackgroundHeight: PropTypes.string,
  buttonBackgroundWidth: PropTypes.string,
  buttonBackgroundTop: PropTypes.string,
  buttonBackgroundRight: PropTypes.string,
  buttonBackgroundBottom: PropTypes.string,
  buttonBackgroundLeft: PropTypes.string,
  buttonWidth: PropTypes.string,
};

export default Text2;
