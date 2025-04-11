import { Link } from "react-router";

const FormLayout = ({ children }) => {
  return (
    <div className="form-container">
      <Link to="/" className="logo-container">
        <p className="logo">
          <span>Ai</span>demy
        </p>
        <p className="tagline">Your AI Study Assistant</p>
      </Link>
      {children}
    </div>
  );
};

export default FormLayout;
