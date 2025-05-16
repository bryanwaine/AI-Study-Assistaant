import React from "react";

import Button from "../../components/Button/Button";

const GenerateBtnGroup = ({
  handleCreateFlashcards,
  handleCreateQuiz,
}) => {
  return (
    <div className="generate-btn__wrapper ">
      <div className="generate-btn__container">
        {/* <Button
        variant="light"
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
        </Button> */}

        <Button
          variant="dark"
          className="generate-btn"
          title="Create flashcards"
          onClick={handleCreateFlashcards}
        >
          <span>Generate Flashcards</span>
        </Button>
        <Button
          variant="dark"
          className="generate-btn"
          title="Create quiz"
          onClick={handleCreateQuiz}
        >
          <span>Generate Quiz</span>
        </Button>
      </div>
    </div>
  );
};

export default GenerateBtnGroup;
