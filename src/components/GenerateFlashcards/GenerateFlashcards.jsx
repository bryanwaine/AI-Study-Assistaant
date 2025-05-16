import React from "react";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import ErrorState from "../ErrorState/ErrorState";
import Button from "../Button/Button";
import CardStack from "../Cardstack/CardStack";

import "./GenerateFlashcards.css";

const GenerateFlashcards = ({
  topic,
  deck,
  numberOfCards,
  inputError,
  loading,
  onChange,
  onInput,
  onSubmit,
  inputSectionRef,
  flashcardError,
}) => {
  return (
    <>
      <div className="generate-section__wrapper">
        <div className="generate-section__container card--white">
          <div
            ref={inputSectionRef}
            className="generate-section__input__heading"
          >
            Generate Flashcards
          </div>
          <div className="generate-section__input__wrapper">
            <div className="generate-section__input__title">
              <label htmlFor="note-topic">Title</label>
              <input
                type="text"
                name="note-topic"
                id="note-topic"
                defaultValue={topic}
                required
              />
            </div>
            <div className="generate-section__input__card-count">
              <label htmlFor="numberOfCards">Number of cards</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                name="numberOfCards"
                id="number-of-cards"
                className={inputError ? "input-error" : ""}
                value={numberOfCards}
                onChange={onChange}
                onInput={onInput}
                required
              />
              {inputError && <span className="error">{inputError}</span>}
            </div>

            <Button
              variant="orange"
              type="submit"
              disabled={!topic || !numberOfCards || loading}
              aria-label="Generate flashcards"
              onClick={() => onSubmit(topic, numberOfCards)}
            >
              {loading ? "Generating Flashcards..." : "Generate Flashcards"}
            </Button>
          </div>
        </div>
      </div>
      {loading && (
        <div className="deck-wrapper__loading">
          <TypingIndicator />
        </div>
      )}
      {!loading && deck.length > 0 && (
        <div className="generate-flashcards__wrapper">
          <div className="generate-flashcards__container">
            <div className="generate-flashcards__deck-wrapper">
              <h2 className="generate-flashcards__deck-title">
                {deck[0].topic.toUpperCase()}
              </h2>
              <CardStack cards={deck} />
            </div>
            {flashcardError && <ErrorState error={flashcardError} />}
          </div>
        </div>
      )}
     
    </>
  );
};

export default GenerateFlashcards;
