import './TextInput.css';

const TextInput = (props) => {
  const { label, type, id, name, handleChange, className, renderError , value} = props;
  return (
    <div className="text-input-wrapper">
      <label htmlFor="email">{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        className={className}
        onChange={handleChange}
        value={value}
        required
      />
      <ul className="error-list">
        {renderError}
      </ul>
    </div>
  );
};

export default TextInput;
