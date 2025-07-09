import React, { useEffect, useState } from "react";

import { useNavigate, Navigate } from "react-router";

import FormLayout from "../components/FormLayout/FormLayout";
import TextInput from "../components/TextInput/TextInput";
import Button from "../components/Button/Button";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import Loader from "../components/Loader/Loader";
import BubbleBackground from "../components/BubbleBg";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import passwordValidation from "../utils/passwordValidation";
import firstNameFilter from "../utils/firstNameFilter";
import emailValidation from "../utils/emailValidation";
import handleFirebaseError from "../utils/firebaseErrorhandler";
import { addUser, setGoogleUser } from "../firebase";

import googleIcon from "../assets/google-icon.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { signup, logInWithGoogle, updateUser, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const userName =
    formData.firstName.toLowerCase() + " " + formData.lastName.toLowerCase();

  useEffect(() => {
    const callback = (entries, slideObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          slideObserver.unobserve(entry.target);
        }
      });
    };

    const options = {
      threshold: 0.2,
    };

    const slideObserver = new IntersectionslideObserver(callback, options);

    const slideAnimatedElements = document.querySelectorAll(".animate-slide");
    slideAnimatedElements.forEach((el) => slideObserver.observe(el));
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const isFormValid =
    formData.firstName.length &&
    formData.lastName.length &&
    formData.email &&
    formData.password.length >= 8;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isPasswordValid, errors } = await passwordValidation(
      formData.password
    );
    const isEmailValid = emailValidation(formData.email);
    const isFirstNameValid = formData.firstName.trim().length >= 2;
    const isLastNameValid = formData.lastName.trim().length >= 2;

    const errorObject = {};
    if (!isPasswordValid) {
      errorObject.password = errors;
    }
    if (!isFirstNameValid) {
      errorObject.firstName = "First name must be at least 2 characters long";
    }
    if (!isLastNameValid) {
      errorObject.lastName = "Last name must be at least 2 characters long";
    }
    if (!isEmailValid) {
      errorObject.email = "Invalid email address";
    }

    if (Object.keys(errorObject).length > 0) {
      setStatus("error");
      setFormError(errorObject);
      return;
    }

    setStatus("submitting");
    setLoading(true);
    const { userName, email, password } = formData;
    try {
      await addUser({
        userName,
        email,
      });
      await signup(email, password);
      await updateUser(userName);
      setStatus("success");
      setLoading(false);
      showToast(`Welcome ${firstNameFilter(userName)}!`, "success");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
      navigate("/dashboard", {
        replace: true,
        state: { userName: userName },
      });
    } catch (error) {
      setLoading(false);
      setStatus("error");
      showToast(handleFirebaseError(error).message, "error");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const data = await logInWithGoogle();
      const { displayName, email, uid } = data.user;
      await setGoogleUser({
        userId: uid,
        userName: displayName,
        email,
      });

      setLoading(false);
      showToast(
        `Welcome back ${firstNameFilter(data?.user.displayName)}!`,
        "success"
      );
      navigate("/dashboard", { replace: true, state: { userName: userName } });
    } catch (error) {
      setLoading(false);
      setStatus("error");
      showToast(handleFirebaseError(error).message, "error");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-y-auto">
      {loading && <Loader />}
      <BubbleBackground />
      <div className="animate-slide">
        <FormLayout
          type="signup-form"
          title="Sign Up"
          message="Already have an account?"
          linkText="Log In"
          link="/login"
          handleSubmit={handleSubmit}
        >
          <TextInput
            label="First Name"
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            className={formError?.firstName?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            renderError={formError?.firstName && <li>{formError.firstName}</li>}
          />
          <TextInput
            label="Last Name"
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            className={formError?.lastName?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            renderError={formError?.lastName && <li>{formError.lastName}</li>}
          />
          <TextInput
            label="Email"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            className={formError?.email?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            renderError={formError?.email && <li>{formError.email}</li>}
          />
          <PasswordInput
            handleChange={handleChange}
            value={formData.password}
            className={formError?.password?.length > 0 ? "input-error" : ""}
            renderError={
              formError?.password?.length > 0 && (
                <ul className="error-list">
                  {formError?.password?.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )
            }
          />
          <Button
            type="submit"
            disabled={status === "submitting" || !isFormValid}
            variant="orange"
            onClick={handleSubmit}
          >
            {status === "submitting" ? "Signing Up..." : "Sign Up"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleGoogleLogin}
            className="!border border-sky-900 !dark:border-sky-400 text-sky-900 dark:text-sky-400 z-10"
          >
            <img src={googleIcon} className="google-icon" alt="google-icon" />
            Sign in with Google
          </Button>
        </FormLayout>
      </div>
    </div>
  );
};

export default Signup;
