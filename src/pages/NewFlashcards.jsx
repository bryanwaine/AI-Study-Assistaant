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
import { saveDeck } from "../utils/flashcardService";
import CardStack from "../components/Cardstack/CardStack";
const NewFlashcards = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [deck, setDeck] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState("");
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState(null);
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const onSubmit = async (topic, numberOfCards) => {
    setInputError(null);
    if (numberOfCards < 5 || numberOfCards > 40) {
      setInputError("Please enter a number between 5 and 40");
      return;
    }
    try {
      const cardTopic = topic;
      const cardCount = numberOfCards;
      setTopic("");
      setNumberOfCards("");
      scrollToBottom();
      setError(null);
      setLoading(true);
      const aiResponse = await generateFlashcards(topic, numberOfCards);
      const parsedResponse = JSON.parse(aiResponse);
      const flashcards = parsedResponse.map((card, index) => ({
        ...card,
        id: card.id || index + 1,
        topic: cardTopic,
      }));
      await saveDeck(user.uid, flashcards, cardTopic, cardCount);
      setDeck(flashcards);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(handleAnthropicError(error).message);
      console.log(error);
    }
  };

  return (
    <>
      <Layout userName={userName} />
      <div className="flashcards-container extended">
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
        <div ref={endRef} />
        <div className="deck-wrapper">
          {loading && (
            <div className="loading-indicator">
              <TypingIndicator />
            </div>
          )}
           {!loading && deck.length > 0 &&
            <>
              <h1>{deck[0].topic.toUpperCase()}</h1>
              <CardStack cards={deck} />
            </>}
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again</p>
            </div>
          )}
        </div>
      </div>
     
    </>
  );
};

export default NewFlashcards;
