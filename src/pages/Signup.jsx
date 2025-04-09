const Signup = () => {
  return (
    <div className="signup-container">
      <div className="logo-container">
              <p className="logo">Br<span>ai</span>nstorm</p>
              <p className="tagline">Your AI Study Assistant</p>
      </div>
      <form className="signup-form" aria-labelledby="signup-form">
        <fieldset>
          <legend>Sign Up</legend>
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
            <button type="submit">Sign Up</button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default Signup;
