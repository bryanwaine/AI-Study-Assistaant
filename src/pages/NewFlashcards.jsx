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
  const [isFrontCardVisible, setIsFrontCardVisible] = useState("");
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsFrontCardVisible("yes");
  }, []);

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

  const trackCardFace = () => {
    setIsFrontCardVisible((prev) => (prev === "yes" ? "no" : "yes"));
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const showPreviousCard = () => {
    const updateDeck = (prev) => 
      prev.map((card, _, array) => ({
        ...card,
        zIndex: card.zIndex === 1 ? array.length : card.zIndex - 1,
      }));
  
    if (isFrontCardVisible === "no") {
      flipCard();
      setIsFrontCardVisible("yes");
    }
  
    setDeck(updateDeck);
  };
  
  const showNextCard = () => {
    const updateDeck = (prev) => 
      prev.map((card, _, array) => ({
        ...card,
        zIndex: card.zIndex === array.length ? 1 : card.zIndex + 1,
      }));
  
    if (isFrontCardVisible === "no") {
      flipCard();
      setIsFrontCardVisible("yes");
    }
    
    setDeck(updateDeck);
  };
  

  const onSubmit = async (topic, numberOfCards) => {
    setDeck([]);
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
          topic: topic,
        })
      );
      setDeck(messagesWithZIndex);
    } catch (error) {
      setLoading(false);
      setError(handleAnthropicError(error).message);
      console.log(error);
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
              placeholder="Enter a topic or subject"
              id="topic"
              value={topic}
              onChange={onChange}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="numberOfCards">Number of cards to generate</label>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              name="numberOfCards"
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
                <div
                  className="front"
                  onClick={() => {
                    flipCard();
                    trackCardFace();
                  }}
                >
                  <span className="card-number">{card.id}</span>
                        <h2>{card.topic.toUpperCase()}</h2>
                        <span className="card-question">Question</span>
                  <h3>{card.question}</h3>
                  <span>Tap to flip</span>
                </div>
                <div
                  className="back"
                  onClick={() => {
                    flipCard();
                    trackCardFace();
                  }}
                >
                        <span className="card-number">{card.id}</span>
                        <span className="card-answer">Answer</span>
                  <p>{card.answer}</p>
                  <span className="card-toggle">Tap to flip</span>
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
