import { useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router";
import FormLayout from "../components/FormLayout";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import errorHandler from "../utils/errorHandler";
import googleIcon from "../assets/google-icon.png";
import firstNameFilter from "../utils/firstNameFilter";
import TextInput from "../components/TextInput";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const [status, setStatus] = useState("idle");
  const [showPassword, setShowPassword] = useState(false);
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
    try {
      const data = await login(formData.email, formData.password);
      setStatus("success");
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
      setStatus("error");
      showToast(errorHandler(error), "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const data = await logInWithGoogle();
      showToast(
        `Welcome back ${firstNameFilter(data?.user.displayName)}!`,
        "success"
      );
      navigate(origin, { replace: true });
    } catch (error) {
      showToast(errorHandler(error), "error");
    }
  };

  return (
    <FormLayout>
      <form
        className="login-form"
        aria-labelledby="login-form"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <legend>Login</legend>
          <div className="form-group-top">
            <p>Don't have an account? </p>
            <Link className="link" to="/signup">
              Sign Up
            </Link>
          </div>
          <TextInput
            label="Email"
            type="email"
            id="email"
            handleChange={handleChange}
            formData={formData}
          />
          <PasswordInput
            label="Password"
            handleChange={handleChange}
            formData={formData}
            showPassword={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          />
          <div className="form-group">
            <button
              className="btn btn-blue"
              type="submit"
              disabled={status === "submitting" || !isFormValid}
            >
              {status === "submitting" ? "Logging in..." : "Login"}
            </button>
            <button
              className="btn btn-transparent"
              type="button"
              onClick={handleGoogleLogin}
            >
              <img src={googleIcon} className="google-icon" alt="google-icon" />
              Sign in with Google
            </button>
          </div>
          <div className="form-group-bottom">
            <Link className="link" to="/">
              Forgotten password?
            </Link>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Login;
