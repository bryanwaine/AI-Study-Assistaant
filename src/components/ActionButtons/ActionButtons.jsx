import React from "react";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import "./ActionButtons.css";

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
