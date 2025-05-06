import { Link } from "react-router";
import "./LogoLg.css";

const LogoLg = ({variant}) => {
  return (
    <Link to="/" className="logo-container">
      <p className={`logo-lg logo-${variant}`}>
        Auxili<span>ai</span>re
      </p>
      <p className={`tagline-lg tagline-${variant}`}>Your AI Study Assistant</p>
    </Link>
  );
};

export default LogoLg;
