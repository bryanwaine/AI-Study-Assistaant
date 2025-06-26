import { useEffect, useState } from "react";

import { useLocation, useNavigate, Navigate } from "react-router";

import FormLayout from "../components/FormLayout/FormLayout";
import TextInput from "../components/TextInput/TextInput";
import PasswordInput from "../components/PasswordInput/PasswordInput";
import Button from "../components/Button/Button";
import Loader from "../components/Loader/Loader";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import firstNameFilter from "../utils/firstNameFilter";
import handleFirebaseError from "../utils/firebaseErrorhandler";
import { setGoogleUser } from "../firebase";
import googleIcon from "../assets/google-icon.png";
import BubbleBackground from "../components/BubbleBg";

const Login = () => {
  const [status, setStatus] = useState("idle");
  const [loading, setLoading] = useState(false);
  const { login, logInWithGoogle, user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const isFormValid = formData.email && formData.password.length >= 8;

  const origin = location.state?.from || "/dashboard";

  useEffect(() => {
    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          observer.unobserve(entry.target);
        }
      });
    };

    const options = {
      threshold: 0.2,
    };

    const observer = new IntersectionObserver(callback, options);

    const animatedElements = document.querySelectorAll(".animate");
    animatedElements.forEach((el) => observer.observe(el));
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setLoading(true);
    try {
      const data = await login(formData.email, formData.password);
      setStatus("success");
      setLoading(false);
      showToast(
        `Welcome back ${firstNameFilter(data?.user.displayName)}!`,
        "success"
      );
      setFormData({
        email: "",
        password: "",
      });
      navigate(origin, { replace: true });
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
      const { uid, displayName, email } = data.user;
      await setGoogleUser({
        userId: uid,
        userName: displayName,
        email,
      });

      setLoading(false);
      showToast(
        `Welcome ${firstNameFilter(data?.user.displayName)}!`,
        "success"
      );
      navigate(origin, { replace: true });
    } catch (error) {
      setLoading(false);
      setStatus("error");
      showToast(handleFirebaseError(error).message, "error");
    }
  };

  return (
    <div className="animate">
      {loading && <Loader />}
      <BubbleBackground />
      <FormLayout
        type="login-form"
        title="Login"
        message="Don't have an account?"
        linkText="Sign Up"
        link="/signup"
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
        <PasswordInput handleChange={handleChange} value={formData.password} />
        <Button
          type="submit"
          variant="orange"
          disabled={status === "submitting" || !isFormValid}
          onClick={handleSubmit}
        >
          {status === "submitting" ? "Logging in..." : "Login"}
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
  );
};

export default Login;
