import { Link } from "react-router";

import LogoLg from "../LogoLg/LogoLg";

import "./FormLayout.css";

const FormLayout = (props) => {
  const { type, title, message, linkText, link, children, handleSubmit } =
    props;
  return (
    <div className="form-container">
      <LogoLg variant="light" />
      <form aria-labelledby={type} onSubmit={handleSubmit} className="bg-gray-900/10 dark:bg-gray-100/10 z-10">
        <fieldset>
          <legend className="dark:text-gray-100">{title}</legend>
          <div className="form-group-top">
            <p className="dark:text-gray-100">{message}</p>
            <Link className="text-sky-900 dark:text-sky-400" to={link}>
              {linkText}
            </Link>
          </div>
          {children}
          {(type === "login-form" || type === "signup-form") && <div className="form-group-bottom z-10">
            <Link className="text-sky-900 dark:text-sky-400" to="/reset-password">
              Forgotten password?
            </Link>
          </div>}
        </fieldset>
      </form>
    </div>
  );
};

export default FormLayout;
