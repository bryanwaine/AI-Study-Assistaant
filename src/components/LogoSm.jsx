import { Link } from "react-router";

const LogoSm = ({variant}) => {
  return (
    <Link to="/" className="logo-container">
      <p className={`logo-sm logo-${variant}`}>
        <span>Ai</span>demy
      </p>
      <p className={`tagline-sm tagline-${variant}`}>Your AI Study Assistant</p>
    </Link>
  );
};

export default LogoSm;