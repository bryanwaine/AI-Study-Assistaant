import "./Button.css";

const Button = (props) => {
  const { children, type, onClick, disabled, variant, ariaLabel, ariaLabelledby, id, className } = props;
  return (
    <button
      className={`btn btn--${variant} ${className}`}
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      id={id}
    >
      {children}
    </button>
  );
};

export default Button;
