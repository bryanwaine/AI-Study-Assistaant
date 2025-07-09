import React, { useEffect } from "react";
import { Link } from "react-router";

import LogoLg from "../LogoLg/LogoLg";

import "./FormLayout.css";

const FormLayout = (props) => {
  const { type, title, message, linkText, link, children, handleSubmit } =
    props;

  useEffect(() => {
    const options = {
      threshold: 0.2,
    };
    const slideCallback = (entries, slideObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          slideObserver.unobserve(entry.target);
        }
      });
    };

    const slideObserver = new IntersectionObserver(slideCallback, options);

    const fadeCallback = (entries, fadeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          fadeObserver.unobserve(entry.target);
        }
      });
    };

    const fadeObserver = new IntersectionObserver(fadeCallback, options);

    const slideAnimatedElements = document.querySelectorAll(".animate-slide");
    slideAnimatedElements.forEach((el) => slideObserver.observe(el));

    const fadeAnimatedElements = document.querySelectorAll(".animate-fade");
    fadeAnimatedElements.forEach((el) => fadeObserver.observe(el));
  });

  return (
    <div className="form-container">
      <div className="animate-fade">
        <LogoLg variant="light" />
      </div>
      <form
        aria-labelledby={type}
        onSubmit={handleSubmit}
        className="animate-slide bg-gray-900/10 dark:bg-gray-100/10 z-10"
      >
        <fieldset>
          <legend className="dark:text-gray-100">{title}</legend>
          <div className="form-group-top">
            <p className="dark:text-gray-100">{message}</p>
            <Link className="text-sky-900 dark:text-sky-400" to={link}>
              {linkText}
            </Link>
          </div>
          {children}
          {(type === "login-form" || type === "signup-form") && (
            <div className="form-group-bottom z-10">
              <Link
                className="text-sky-900 dark:text-sky-400"
                to="/reset-password"
              >
                Forgotten password?
              </Link>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
};

export default FormLayout;
