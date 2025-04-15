const PasswordInput = (props) => {
    const{handleChange, className, value, renderError, showPassword, onClick} = props
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
                onClick={onClick}
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