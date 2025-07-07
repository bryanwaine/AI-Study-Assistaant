import React, { useEffect, useRef } from "react";

import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";

import Button from "../Button/Button";

import "./TextArea.css";
const TextArea = ({ value, onChange, onSubmit, loading }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  console.log(isMobile);
  
  const handleKeyDown = (event) => {
    if (loading) return;
    if (!isMobile) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSubmit();
      }
    }
  };

  return (
    <div className="textarea-wrapper bg-[#f5f5f5] dark:bg-[#001826]">
      <div className="textarea-container bg-sky-100 dark:bg-black">
        <textarea
          enterKeyHint="enter"
          ref={textareaRef}
          rows={2}
          className="textarea-input bg-sky-100 dark:bg-black text-neutral-900 dark:text-neutral-100"
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
            id="speech button"
            ariaLabel="speech button"
            ariaLabelledby="speech button"
          >
            <KeyboardVoiceOutlinedIcon fontSize="small" />
          </Button>
          <Button
            variant="orange"
            onClick={onSubmit}
            id="submit"
            ariaLabel="submit"
            ariaLabelledby="submit"
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
