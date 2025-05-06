import React from "react";
import Button from "../Button/Button";
import "./ErrorState.css";


export const ErrorState = (props) => {
  const { error, onResubmit } = props;
  return (
    <div className="chat-error-container">
      <p className="error">{`${error} || Something went wrong. Please try again`}</p>
     { onResubmit && <Button variant="orange" onClick={onResubmit}>
        Retry
      </Button>}
    </div>
  );
};

export default ErrorState;
