import { Link, useLocation, useNavigate } from "react-router";
import FormLayout from "../components/FormLayout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";

const Login = () => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const { login, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const origin = location.state?.from || "/dashboard";

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
      await login(formData.email, formData.password);
      setStatus("success");
      navigate(origin, { replace: true });
    } catch (error) {
      setStatus("error");
      setError(error.message);
      console.log(`${error.code} - ${error.message}`);
    }

    setFormData({
      email: "",
      password: "",
    });
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
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </div>
          <div className="form-group">
            <button
              className="btn btn-blue"
              type="submit"
              disabled={status === "submitting"}
            >
              Login
            </button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Login;
