import { Link, useNavigate } from "react-router";
import FormLayout from "../components/FormLayout";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const { signup, updateUser, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

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
      const displayName = `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`;
      await signup(formData.email, formData.password);
      await updateUser(displayName, formData.photoURL);
      setStatus("success");
      navigate("/dashboard", { replace: false });
    } catch (error) {
      setStatus("error");
      setError(error.message);
      console.log(`${error.code} - ${error.message}`);
    }

    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    });
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
              Sign Up
            </button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Signup;
