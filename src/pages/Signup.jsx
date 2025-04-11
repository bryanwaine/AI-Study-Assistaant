import { Link } from "react-router";
import FormLayout from "../components/FormLayout";

const Signup = () => {
  const handleSubmit = (formData) => {
    console.log(formData.get("firstName"));
  };
  return (
    <FormLayout>
      <form
        className="signup-form"
        aria-labelledby="signup-form"
        action={handleSubmit}
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
            <input type="text" id="firstName" name="firstName" required />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="form-group">
            <button className="btn btn-blue" type="submit">
              Sign Up
            </button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Signup;
