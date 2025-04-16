import { Link } from "react-router";

const LogoLg = ({variant}) => {
  return (
    <Link to="/" className="logo-container">
      <p className={`logo-lg logo-${variant}`}>
        <span>Ai</span>demy
      </p>
      <p className={`tagline-lg tagline-${variant}`}>Your AI Study Assistant</p>
    </Link>
  );
};

export default LogoLg;
