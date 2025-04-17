const Button = (props) => {
    const {children, type, onClick, disabled, variant} = props
    return (
        <button
              className={`btn btn--${variant}`}
              type={type}
              disabled={disabled}
              onClick={onClick}
            >
             {children}
            </button>
    );
}

export default Button