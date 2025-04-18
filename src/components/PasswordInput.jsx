import { useState } from "react";

const PasswordInput = (props) => {
    const { handleChange, className, value, renderError } = props
    
    const [showPassword, setShowPassword] = useState(false);
        
        (false);
    return (
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={className}
                onChange={handleChange}
                value={value}
                required
              />
              <span
                role="button"
                tabIndex="0"
                aria-label={showPassword ? "hide password" : "show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="password-toggle"
              >
                {showPassword ? "hide" : "show"}
              </span>
            </div>
           {renderError}
          </div>
    )
}

export default PasswordInput