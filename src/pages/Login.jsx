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
import Button from "../components/Button";

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
        `Welcome ${firstNameFilter(data?.user.displayName)}!`,
        "success"
      );
      navigate(origin, { replace: true });
    } catch (error) {
      showToast(errorHandler(error), "error");
    }
  };

  return (
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
          <PasswordInput
            handleChange={handleChange}
            value={formData.password}
            showPassword={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          />
            <Button
              type="submit"
              variant="primary"
              disabled={status === "submitting" || !isFormValid}
              onClick={handleSubmit}
            >
              {status === "submitting" ? "Logging in..." : "Login"}
            </Button>
            <Button variant="ghost" onClick={handleGoogleLogin}>
              <img src={googleIcon} className="google-icon" alt="google-icon" />
              Sign in with Google
            </Button>
          <div className="form-group-bottom">
            <Link className="link" to="/reset-password">
              Forgotten password?
            </Link>
          </div>
    </FormLayout>
  );
};

export default Login;
