const Button = (props) => {
  const { children, type, onClick, disabled, variant, ariaLabel } = props;
  return (
    <button
      className={`btn btn--${variant}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;
