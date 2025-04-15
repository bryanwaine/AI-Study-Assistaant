import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import FormLayout from "../components/FormLayout";
import useAuth from "../hooks/useAuth";
import passwordValidation from "../utils/passwordValidation";
import useToast from "../hooks/useToast";
import errorHandler from "../utils/errorHandler";
import googleIcon from "../assets/google-icon.png";
import firstNameFilter from "../utils/firstNameFilter";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("idle");
  const [formError, setFormError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signup, logInWithGoogle, updateUser, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

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
    const { isPasswordValid, errors } = await passwordValidation(formData.password);
    const isEmailValid = /\S+@\S+\.\S+/.test(formData.email);
    const isFirstNameValid = formData.firstName.length >= 2;
    const isLastNameValid = formData.lastName.length >= 2;

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
        replace: true,
        state: { userName: userName },
      });
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
          <TextInput
            label="First Name"
            type="text"
            id="firstName"
            name="firstName"
            className={formError?.firstName?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            value={formData.firstName}
            renderError={formError?.firstName && <li>{formError.firstName}</li>}
          />
          <TextInput
            label="Last Name"
            type="text"
            id="lastName"
            name="lastName"
            className={formError?.lastName?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            value={formData.lastName}
            renderError={formError?.lastName && <li>{formError.lastName}</li>}
          />
          <TextInput
            label="Email"
            type="email"
            id="email"
            name="email"
            className={formError?.email?.length > 0 ? "input-error" : ""}
            handleChange={handleChange}
            value={formData.email}
            renderError={formError?.email && <li>{formError.email}</li>}
          />
          <PasswordInput
            handleChange={handleChange}
            className={formError?.password?.length > 0 ? "input-error" : ""}
            value={formData.password}
            showPassword={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            renderError={formError?.password?.length > 0 && (
                <ul className="error-list">
                  {formError?.password?.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
          />
          <div className="form-group">
            <Button
              type="submit"
              disabled={status === "submitting" || !isFormValid}
              variant="primary"
              onClick={handleSubmit}
            >
              {status === "submitting" ? "Signing Up..." : "Sign Up"}
            </Button>
            <Button type="submit" variant="ghost" onClick={handleGoogleLogin}>
              <img src={googleIcon} className="google-icon" alt="google-icon" />
              Sign In with Google
            </Button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Signup;
