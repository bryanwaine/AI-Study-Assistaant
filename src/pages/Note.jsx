import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import { getNote } from "../utils/noteService";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { useLocation, useParams } from "react-router";
import Loader from "../components/Loader";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { saveDeck } from "../utils/flashcardService";
import { generateFlashcardsFromNotes } from "../anthropic";
import Button from "../components/Button";
import TypingIndicator from "../components/TypingIndicator";
import CardStack from "../components/Cardstack/CardStack";

const Note = () => {
  const [fetching, setFetching] = useState(false);
  const [summary, setSummary] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const [deck, setDeck] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState("");
  const [inputError, setInputError] = useState(null);
  ("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [createFlashcards, setCreateFlashcards] = useState(false);
  const [createQuiz, setCreateQuiz] = useState(false);

  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const { noteId } = useParams();
  const aiMessageRef = useRef(null);
  const inputSectionRef = useRef(null);
  const cardStackRef = useRef(null);

  const scrollToBottom = () => {
    cardStackRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInputSection = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToInputSection();
  }, [createFlashcards, createQuiz]);
  
  useEffect(() => {
    scrollToBottom();
  }, [deck]);

  useEffect(() => {
    const fetchNote = async () => {
      setFetching(true);
      try {
        const data = await getNote(user.uid, noteId);
        setSummary(data.summary);
        setMetaData(data.metadata);
        setNotes(data.summary[0].content);
        console.log(data.summary[0].content.slice(0, 100));
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchNote();
    }
  }, [noteId, user]);

  if (!user) return <Navigate to="/login" replace />;

  const handleCopy = () => {
    if (aiMessageRef.current) {
      navigator.clipboard.writeText(aiMessageRef.current.textContent);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

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

  const handleCreateFlashcards = () => {
    setCreateQuiz(false);
    setCreateFlashcards(true);
    setTopic(metaData.title.toUpperCase());
  };

  const handleCreateQuiz = () => {
    setCreateFlashcards(false);
    setCreateQuiz(true);
    setTopic(metaData.title.toUpperCase());
  };

  const onSubmit = async () => {
    setInputError(null);
    if (numberOfCards < 5 || numberOfCards > 40) {
      setInputError("Please enter a number between 5 and 40");
      return;
    }
    try {
      const cardTopic = topic;
      const cardCount = numberOfCards;
      setNumberOfCards("");
      scrollToBottom();
      setError(null);
      setLoading(true);
      const aiResponse = await generateFlashcardsFromNotes(
        notes,
        numberOfCards
      );
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
      console.log(error);
      setLoading(false);
      setError(handleAnthropicError(error).message);
    }
  };

  return (
    <>
      <Layout userName={userName} />
      <div className="notes-wrapper">
        {fetching && <Loader />}
        {metaData?.title && (
          <div className="notes-title">{metaData.title.toUpperCase()}</div>
        )}
        <div className="notes-container">
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again.</p>
            </div>
          )}
          {summary?.map(
            (message) =>
              message.role === "assistant" && (
                <div
                  key={message.id}
                  className={`note-summary ${message.role}`}
                >
                  <div ref={aiMessageRef}>
                    <MarkdownRenderer>{message.content}</MarkdownRenderer>
                  </div>
                </div>
              )
          )}
        </div>
        <div className="notes-wrapper-action-buttons">
          <button
            className="message-copy-button"
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

          <button
            className="message-copy-button"
            title="Create flashcards"
            onClick={handleCreateFlashcards}
          >
            <span>
              <StyleOutlinedIcon style={{ fontSize: ".85rem" }} />
              Flashcards
            </span>
          </button>
          <button
            className="message-copy-button"
            title="Create quiz"
            onClick={handleCreateQuiz}
          >
            <span>
              <QuizOutlinedIcon style={{ fontSize: ".85rem" }} />
              Quiz
            </span>
          </button>
        </div>
      </div>
      {createFlashcards && (
        <>
          <div ref={inputSectionRef} style={{ height: "4rem" }} />
          <div className="input-wrapper notes">
            <p className="input-title">{`Generate flashcards from ${topic}`}</p>
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
          <div className="flashcards-container regular">
            <div className="deck-wrapper">
            <div ref={cardStackRef } style={{ height: "4rem" }}/>
              {loading && (
                <div className="loading-indicator">
                  <TypingIndicator />
                </div>
              )}
              {!loading && deck.length > 0 && (
                <>
                  <h1>{deck[0].topic.toUpperCase()}</h1>
                  <CardStack cards={deck} />
                </>
              )}
              {error && (
                <div className="chat-error-container">
                  <p className="error">
                    Something went wrong. Please try again
                  </p>
                </div>
              )}
            </div>
           
          </div>
        </>
      )}
      {createQuiz && (
        <div>
          <div ref={inputSectionRef} style={{ height: "4rem" }} />
          <div className="input-wrapper notes">
            <p className="input-title">{`Generate quiz from ${topic}`}</p>
            <div className="input-container">
              <label htmlFor="numberOfCards">Number of questions</label>
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
              // onClick={() => onSubmit(topic, numberOfCards)}
            >
              {loading ? "Generating Quiz..." : "Generate Quiz"}
            </Button>
          </div>
          <div className="flashcards-container extended">
            <div ref={cardStackRef} style={{ height: "4rem" }} />
            <div className="deck-wrapper">
              {loading && (
                <div className="loading-indicator">
                  <TypingIndicator />
                </div>
              )}
              {!loading && deck.length > 0 && (
                <>
                  <h1>{deck[0].topic.toUpperCase()}</h1>
                  <CardStack cards={deck} />
                </>
              )}
              {error && (
                <div className="chat-error-container">
                  <p className="error">
                    Something went wrong. Please try again
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Note;
