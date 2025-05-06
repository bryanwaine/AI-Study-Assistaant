import { Link } from "react-router";
import "./LogoSm.css";

const LogoSm = ({variant}) => {
  return (
    <Link to="/" className="logo-container">
      <p className={`logo-sm logo-${variant}`}>
      Auxili<span>ai</span>re
      </p>
      <p className={`tagline-sm tagline-${variant}`}>Your AI Study Assistant</p>
    </Link>
  );
};

export default LogoSm;