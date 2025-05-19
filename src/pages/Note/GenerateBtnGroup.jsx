import React from "react";

import Button from "../../components/Button/Button";

const GenerateBtnGroup = ({ handleGenerateFlashcards, handleGenerateQuiz, generateFlashcards, generateQuiz }) => {
  return (
    <div className="generate-btn__wrapper ">
      <div className="generate-btn__container">
        <Button
          variant={generateFlashcards ? "dark" : "ghost--dark"}
          title="Create flashcards"
          onClick={handleGenerateFlashcards}
        >
          <span>Generate Flashcards</span>
        </Button>
        <Button
          variant={generateQuiz ? "dark" : "ghost--dark"}
          title="Create quiz"
          onClick={handleGenerateQuiz}
        >
          <span>Generate Quiz</span>
        </Button>
      </div>
    </div>
  );
};

export default GenerateBtnGroup;
