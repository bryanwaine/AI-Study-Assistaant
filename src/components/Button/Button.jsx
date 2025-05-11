import "./Button.css";

const Button = (props) => {
  const { children, type, onClick, disabled, variant, ariaLabel, ariaLabelledby, id } = props;
  return (
    <button
      className={`btn btn--${variant}`}
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
