import React from "react";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import "./ActionButtons.css";

/**
 * A component that renders a small button to copy code to the clipboard.
 *
 * @param {function} handleCopy a function that will be called when the button is clicked
 * @param {boolean} isCopied a boolean indicating whether the code has been copied
 *
 * @returns {ReactElement} a JSX element representing the button
 */
const ActionButtons = ({ handleCopy, isCopied }) => {
  return (
    <div className="action-buttons__wrapper ">
      <div className="action-buttons__container">
        <button
          className="action-button"
          onClick={() => handleCopy()}
          title="Copy code"
        >
          {isCopied ? (
            <span>
              <CheckOutlinedIcon style={{ fontSize: ".85rem" }} /> Copied!
            </span>
          ) : (
            <span>
              <ContentCopyOutlinedIcon style={{ fontSize: ".85rem" }} />
              Copy
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
