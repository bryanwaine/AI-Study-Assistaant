import { Link } from "react-router";
import LogoLg from "./LogoLg";

const FormLayout = (props) => {
    const { type, title, message, linkText, link, children, handleSubmit, } = props;
  return (
    <div className="form-container">
      <LogoLg variant="light"/>
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
