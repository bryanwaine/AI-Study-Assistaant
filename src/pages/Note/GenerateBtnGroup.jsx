import React from "react";

import Button from "../../components/Button/Button";

const GenerateBtnGroup = ({ handleGenerateFlashcards, handleGenerateQuiz, generateFlashcards, generateQuiz }) => {
  return (
    <div className="generate-btn__wrapper ">
      <div className="generate-btn__container card--white">
        <Button
          variant={generateFlashcards ? "dark" : "ghost--dark"}
          title="Create flashcards"
          onClick={handleGenerateFlashcards}
        >
          <span>Generate<br/>Flashcards</span>
        </Button>
        <Button
          variant={generateQuiz ? "dark" : "ghost--dark"}
          title="Create quiz"
          onClick={handleGenerateQuiz}
        >
          <span>Generate<br/>Quiz</span>
        </Button>
      </div>
    </div>
  );
};

export default GenerateBtnGroup;
