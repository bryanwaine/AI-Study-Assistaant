const TextInput = (props) => {
  const { label, type, id, handleChange, formData, formError } = props;
  return (
    <div className="form-group">
      <label htmlFor="email">{label}</label>
      <input
        type={type}
        id={id}
        name={type}
        className={formError?.email?.length > 0 ? "input-error" : ""}
        onChange={handleChange}
        value={formData.email}
        required
      />
      <ul className="error-list">
        {formError?.email && <li>{formError.email}</li>}
      </ul>
    </div>
  );
};

export default TextInput;
