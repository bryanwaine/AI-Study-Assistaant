import { Link } from "react-router";
import FormLayout from "../components/FormLayout";

const Login = () => {
  return (
    <FormLayout>
      <form className="login-form" aria-labelledby="login-form">
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
            <input type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <div className="form-group">
            <button className="btn btn-blue" type="submit">
              Login
            </button>
          </div>
        </fieldset>
      </form>
    </FormLayout>
  );
};

export default Login;
