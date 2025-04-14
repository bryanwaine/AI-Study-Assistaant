import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import FormLayout from "../components/FormLayout";
import useAuth from "../hooks/useAuth";
import passwordValidation from "../utils/passwordValidation";
import useToast from "../hooks/useToast";
import errorHandler from "../utils/errorHandler";
import googleIcon from "../assets/google-icon.png";
import firstNameFilter from "../utils/firstNameFilter";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, logInWithGoogle, updateUser, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
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
    const { isValid, errors } = await passwordValidation(formData.password);
    if (!isValid) {
      setStatus("error");
      setError(errors);
      return;
    }
    setStatus("submitting");
    try {
      const userName =
        formData.firstName.toLowerCase() +
        " " +
        formData.lastName.toLowerCase();
      await signup(formData.email, formData.password);
      await updateUser(userName, formData.photoURL);
      setStatus("success");
      showToast(`Welcome ${firstNameFilter(userName)}!`, "success");
      setFormData({
        userName: "",
        email: "",
        password: "",
      });
      navigate("/dashboard", {
        replace: false,
        state: { userName: userName },
      });
    } catch (error) {
      setStatus("error");
      showToast(errorHandler(error), "error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await logInWithGoogle();
      showToast(
        `Welcome ${firstNameFilter(result?.user.displayName)}!`,
        "success"
      );
      navigate("/dashboard", { replace: true });
    } catch (error) {
      showToast(errorHandler(error), "error");
    }
  };

  return (
    <FormLayout>
      <form
        className="signup-form"
        aria-labelledby="signup-form"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <legend>Sign Up</legend>
          <div className="form-group-top">
            <p>Already have an account? </p>
            <Link className="link" to="/login">
              Login
            </Link>
          </div>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              onChange={handleChange}
              value={formData.firstName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              onChange={handleChange}
              value={formData.lastName}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <span
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="password-toggle"
              >
                {showPassword ? "hide" : "show"}
              </span>
            </div>
            {error?.length > 0 && (
              <ul className="error">
                {error?.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <button
              className="btn btn-blue"
              type="submit"
              disabled={status === "submitting" || !isFormValid}
            >
              {status === "submitting" ? "Signing Up..." : "Sign Up"}
            </button>
            <button
              className="btn btn-transparent"
              type="button"
              onClick={handleGoogleLogin}
            >
              <img src={googleIcon} className="google-icon" alt="google-icon" />
              Sign Up with Google
            </button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Signup;
