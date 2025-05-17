import { useEffect, useRef, useState } from "react";

import { Navigate } from "react-router";
import "highlight.js/styles/github.css";

import { generateFlashcards } from "../../anthropic";
import TypingIndicator from "../../components/TypingIndicator/TypingIndicator";
import Layout from "../../components/Layout";
import Button from "../../components/Button/Button";
import CardStack from "../../components/Cardstack/CardStack";
import ErrorState from "../../components/ErrorState/ErrorState";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { saveDeck } from "../../utils/flashcardService";

import "./NewFlashcards.css";
const NewFlashcards = () => {
  const [topic, setTopic] = useState("");
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [deck, setDeck] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState("");
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const [showBottomRef, setShowBottomRef] = useState(false);

  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  const bottomRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [loadingFlashcards]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "topic") {
      setTopic(value);
    }
    if (name === "numberOfCards") {
      setNumberOfCards(value);
    }
  };

  const onInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const onSubmit = async () => {
    setInputError(null);
    if (numberOfCards < 20 || numberOfCards > 40) {
      setInputError("Please enter a number between 20 and 40");
      return;
    }
    setShowBottomRef(true);
    try {
      const cardTopic = topic;
      const cardCount = numberOfCards;
      setTopic("");
      setNumberOfCards("");
      scrollToBottom();
      setError(null);
      setLoadingFlashcards(true);
      const aiResponse = await generateFlashcards(topic, numberOfCards);
      const parsedResponse = JSON.parse(aiResponse);
      const flashcards = parsedResponse.map((card, index) => ({
        ...card,
        id: card.id || index + 1,
        topic: cardTopic,
      }));
      await saveDeck(user.uid, flashcards, cardTopic, cardCount);
      setDeck(flashcards);
      setLoadingFlashcards(false);
    } catch (error) {
      setLoadingFlashcards(false);
      setError(handleAnthropicError(error).message);
    }
  };

  return (
    <div className="new-flashcards__wrapper">
      <Layout userName={userName} />
      <div className="new-flashcards__container">
        <div className="new-flashcards__input-wrapper">
          <div className="new-flashcards__input-container card--white">
            <div className="new-flashcards__input ">
              <label htmlFor="topic">Topic</label>
              <input
                type="text"
                name="topic"
                placeholder="Enter a topic or subject"
                id="topic"
                value={topic}
                onChange={onChange}
                required
              />
            </div>
            <div className="new-flashcards__input">
              <label htmlFor="numberOfCards">Number of cards</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                name="numberOfCards"
                id="number-of-cards"
                placeholder="Enter a number between 20 and 40"
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
              disabled={!topic || !numberOfCards || loadingFlashcards}
              aria-label="Generate flashcards"
              onClick={() => onSubmit(topic, numberOfCards)}
            >
              {loadingFlashcards
                ? "Generating Flashcards..."
                : "Generate Flashcards"}
            </Button>
          </div>
        </div>

        {loadingFlashcards ? (
          <div className="new-flashcards__deck-wrapper__loading">
            <TypingIndicator />
          </div>
        ) : error ? (
          <ErrorState />
        ) : (
          deck.length > 0 && (
            <div className="new-flashcards__deck-wrapper">
              <h1>{deck[0].topic.toUpperCase()}</h1>
              <CardStack cards={deck} />
            </div>
          )
        )}
        
        {showBottomRef && (
          <div ref={bottomRef} style={{ height: "1px", width: "100%" }} />
        )}
      </div>
    </div>
  );
};

export default NewFlashcards;
