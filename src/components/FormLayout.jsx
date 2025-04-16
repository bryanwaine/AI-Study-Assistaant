import { Link } from "react-router";

const FormLayout = (props) => {
    const { type, title, message, linkText, link, children, handleSubmit, } = props;
  return (
    <div className="form-container">
      <Link to="/" className="logo-container">
        <p className="logo">
          <span>Ai</span>demy
        </p>
        <p className="tagline">Your AI Study Assistant</p>
      </Link>
      <form  aria-labelledby={type} onSubmit={handleSubmit}>
        <fieldset>
          <legend>{title}</legend>
          <div className="form-group-top">
            <p>{message}</p>
            <Link className="link" to={link}>
              {linkText}
            </Link>
          </div>
          {children}
        </fieldset>
      </form>
    </div>
  );
};

export default FormLayout;
