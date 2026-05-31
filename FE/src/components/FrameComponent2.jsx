import SharedHeader from "./SharedHeader";
import PropTypes from "prop-types";

const FrameComponent2 = ({ className = "" }) => {
  return <SharedHeader className={className} theme="light" />;
};

FrameComponent2.propTypes = {
  className: PropTypes.string,
};

export default FrameComponent2;
