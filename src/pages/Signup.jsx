import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import FormLayout from "../components/FormLayout";
import useAuth from "../hooks/useAuth";
import passwordValidation from "../utils/passwordValidation";
import useToast from "../hooks/useToast";

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
    const { signup, updateUser, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const isFormValid =
    formData.userName &&
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
      console.log(errors);
      console.log(formData.password);
      return;
    }
    setStatus("submitting");
    try {
      await signup(formData.email, formData.password);
      await updateUser(formData.userName.toLowerCase(), formData.photoURL);
        setStatus("success");
        showToast(`Welcome ${formData.userName}!`, "success");
      setFormData({
        userName: "",
        email: "",
        password: "",
      });
      navigate("/dashboard", { replace: false, state: {userName: formData.userName} });
    } catch (error) {
      setStatus("error");
      setError(error.message);
      console.log(`${error.code} - ${error.message}`);
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
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              onChange={handleChange}
              value={formData.userName}
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
                {showPassword ? 'hide' : 'show'}
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
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Signup;
