import { useEffect, useRef } from "react";
import Button from "./Button";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
const TextArea = ({ value, onChange, onSubmit, loading }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleKeyDown = (event) => {
    if (loading) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="textarea-wrapper">
      <div className="textarea-container">
        <textarea
          ref={textareaRef}
          rows={2}
          className="textarea-input"
          placeholder="Ask anything..."
          id="question"
          name="question"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          required
        />
        <div className="textarea-buttons">
          <Button
            variant="ghost--orange"
            onClick={onSubmit}
            ariaLabel="submit"
            className="submit-btn"
          >
            <AddOutlinedIcon fontSize="small" />
          </Button>
          <Button
            variant="orange"
            onClick={onSubmit}
            ariaLabel="submit"
            disabled={!value || loading}
          >
            <ArrowUpwardOutlinedIcon fontSize="small" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextArea;
