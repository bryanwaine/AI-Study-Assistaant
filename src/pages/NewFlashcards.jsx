import { useEffect, useRef, useState } from "react";
import { Navigate } from "react-router";
import { generateFlashcards } from "../anthropic";
import "highlight.js/styles/github.css";
import TypingIndicator from "../components/TypingIndicator";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Button from "../components/Button";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
const NewFlashcards = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState("");
  const [error, setError] = useState(null);
  const [deckId, setDeckId] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //   useEffect(() => {
  //     window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  //   }, []);

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

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const showPreviousCard = () => {
    setDeck((prev) => {
      const newDeck = prev.map((deck, index, array) => {
        let newZIndex;
        if (deck.zIndex === 1) {
          newZIndex = array.length;
        } else {
          newZIndex = deck.zIndex - 1;
        }
        return {
          ...deck,
          zIndex: newZIndex,
        };
      });
      return newDeck;
    });
  };
  const showNextCard = () => {
    setDeck((prev) => {
      const newDeck = prev.map((deck, index, array) => {
        let newZIndex;
        if (deck.zIndex === array.length) {
          newZIndex = 1;
        } else {
          newZIndex = deck.zIndex + 1;
        }
        return {
          ...deck,
          zIndex: newZIndex,
        };
      });
      return newDeck;
    });
  };

  const onSubmit = async (topic, numberOfCards) => {
    scrollToBottom();
    setError(null);
    setLoading(true);
    try {
      const aiResponse = await generateFlashcards(topic, numberOfCards);
      setLoading(false);
      const parsedResponse = JSON.parse(aiResponse);
      const messagesWithZIndex = parsedResponse.map(
        (message, index, array) => ({
          ...message,
          zIndex: array.length - index,
        })
      );
      setDeck(messagesWithZIndex);
    } catch (error) {
      setLoading(false);
      setError(handleAnthropicError(error).message);
    }
  };

  return (
    <>
      <Layout userName={userName} />
      <div className="flashcards-container">
        <div className="input-wrapper">
          <div className="input-container">
            <label htmlFor="topic">Topic</label>
            <input
              type="text"
              name="topic"
              placeholder="JavaScript Concepts"
              id="topic"
              value={topic}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="numberOfCards">Number of Cards</label>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              name="numberOfCards"
              placeholder="10"
              id="number-of-cards"
              value={numberOfCards}
              onChange={onChange}
              onInput={onInput}
              required
            />
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

        <div className="deck-wrapper">
          {loading && (
            <div className="loading-indicator">
              <TypingIndicator />
            </div>
          )}
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again</p>
            </div>
          )}
          {deck?.map((card) => {
            return (
              <div
                className={`flashcard ${isFlipped ? "flipped" : ""}`}
                key={card.id}
                style={{ zIndex: card.zIndex }}
              >
                <div className="front" onClick={flipCard}>
                  <span className="card-number">{card.id}</span>
                  <h2>{card.question}</h2>
                  <span>Tap to flip</span>
                </div>
                <div className="back" onClick={flipCard}>
                  <span className="card-number">{card.id}</span>
                  <p>{card.answer}</p>
                  <span>Tap to flip</span>
                </div>
                
              </div>
            );
          })}
          {deck?.length > 0 && (
            <div className="navigation">
              <Button
                variant="ghost--orange"
                onClick={showPreviousCard}
                style={{ margin: 0, width: "2rem" }}
              >
                <KeyboardArrowLeftOutlinedIcon />
              </Button>

              <Button
                variant="ghost--orange"
                onClick={showNextCard}
                style={{ margin: 0 }}
              >
                <KeyboardArrowRightOutlinedIcon />
              </Button>
            </div>
          )}
        </div>
          </div>
          <div ref={endRef} />
    </>
  );
};

export default NewFlashcards;
