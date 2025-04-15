const PasswordInput = (props) => {
    const{label, handleChange, formData, formError, showPassword, onClick} = props
    return (
        <div className="form-group">
            <label htmlFor="password">{label}</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={formError?.password?.length > 0 ? "input-error" : ""}
                onChange={handleChange}
                value={formData.password}
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
            {formError?.password?.length > 0 && (
              <ul className="error-list">
                {formError?.password?.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            )}
          </div>
    )
}

export default PasswordInput