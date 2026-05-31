import SharedHeader from "./SharedHeader";
import PropTypes from "prop-types";

const Header1 = ({ className = "" }) => {
  return <SharedHeader className={className} theme="light" />;
};

Header1.propTypes = {
  className: PropTypes.string,
};

export default Header1;
