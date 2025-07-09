import React, { useEffect, useState } from "react";

import { Link } from "react-router";

import FormLayout from "../components/FormLayout/FormLayout";
import TextInput from "../components/TextInput/TextInput";
import Button from "../components/Button/Button";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import emailValidation from "../utils/emailValidation";
import handleFirebaseError from "../utils/firebaseErrorhandler";
import BubbleBackground from "../components/BubbleBg";

const ResetPassword = () => {
  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    email: "",
  });

  const { resetPassword } = useAuth();
  const { showToast } = useToast();

  const isFormValid = formData.email && emailValidation(formData.email);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting");
    try {
      const data = await resetPassword(formData.email);
      setStatus("success");
      showToast("Password reset email sent", "success");
      console.log(data);
    } catch (error) {
      setStatus("error");
      showToast(handleFirebaseError(error).message, "error");
    }
  };

  return status === "success" ? (
    <div className="animate-slide relative">
      <BubbleBackground />
      <FormLayout
        type="reset-password"
        title="Reset Password"
        message="✅ Password reset link sent."
      >
        <p style={{ padding: 0, marginTop: "-1rem" }}>
          Please check your email for instructions on how to reset your
          password.
        </p>
        <Link style={{ marginTop: "1rem" }} className="link" to="/login">
          Back to Login
        </Link>
      </FormLayout>
    </div>
  ) : (
    <div className="animate-slide relative">
      <BubbleBackground />
      <FormLayout
        type="reset-password"
        title="Reset Password"
        message="Please enter your email address"
        handleSubmit={handleSubmit}
      >
        <TextInput
          label="Email"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          handleChange={handleChange}
        />
        <Button
          type="submit"
          variant="orange"
          disabled={status === "Submitting" || !isFormValid}
        >
          {" "}
          {status === "Submitting"
            ? "Sending Reset Email..."
            : "Send Reset Email"}
        </Button>
      </FormLayout>
    </div>
  );
};

export default ResetPassword;
