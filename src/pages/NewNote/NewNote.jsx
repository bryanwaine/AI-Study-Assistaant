import { useEffect, useRef, useState } from "react";

import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";

import {
  generateFlashcardsFromNotes,
  generateNoteSummary,
} from "../../anthropic";
import FileUploadProcessor from "../../components/FileUploadProcessor/FileUploadProcessor";
import Layout from "../../components/Layout";
import TypingIndicator from "../../components/TypingIndicator/TypingIndicator";
import MarkdownRenderer from "../../components/MarkdownRenderer";
import Button from "../../components/Button/Button";
import ErrorState from "../../components/ErrorState/ErrorState";
import CardStack from "../../components/Cardstack/CardStack";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { saveNote, updateNote } from "../../utils/noteService";
import { saveDeck } from "../../utils/flashcardService";

import "./NewNote.css";
import "../NewFlashcards/NewFlashcards.css";

const NewNote = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [partialContent, setPartialContent] = useState("");
  const [fileUploadProps, setFileUploadProps] = useState({});
  const [createFlashcards, setCreateFlashcards] = useState(false);
  const [createQuiz, setCreateQuiz] = useState(false);
  const [topic, setTopic] = useState("");
  const [deck, setDeck] = useState([]);
  const [notes, setNotes] = useState("");
  const [numberOfCards, setNumberOfCards] = useState("");
  const [inputError, setInputError] = useState(null);
  ("");
  const [isCopied, setIsCopied] = useState(false);
  const [title, setTitle] = useState("");
  const [isResponseGenerated, setIsResponseGenerated] = useState(false);
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const isTitleValid = title.trim().length > 0;
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

  if (!user) return <Navigate to="/login" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value);
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
  };

  const handleCreateQuiz = () => {
    setCreateFlashcards(false);
    setCreateQuiz(true);
  };

  const handleCopy = () => {
    if (aiMessageRef.current) {
      navigator.clipboard.writeText(aiMessageRef.current.textContent);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const onSubmit = async (fileUploadProps) => {
    const { text, fileName, setDisplayFileName, setStatus } = fileUploadProps;
    setNotes(text);
    setTopic(title);
    setSummary([]);
    setIsResponseGenerated(false);

    if (!text || !isTitleValid) {
      console.log("No text or title provided");
      return;
    }
    try {
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: text,
      };
      setTitle("");
      setStatus(null);
      setLoading(true);
      setIsResponseGenerated(true);
      const updatedSummary = [...summary, userMessage];
      setSummary(updatedSummary);
      let newNoteId;
      if (!noteId) {
        newNoteId = await saveNote(user.uid, updatedSummary, title, fileName);
        setNoteId(newNoteId);
      } else {
        await updateNote(user.uid, noteId || newNoteId, updatedSummary);
      }
      setDisplayFileName("");
      const aiResponse = await generateNoteSummary(text);
      const words = aiResponse.split(" ");
      let currentWord = 0;
      setPartialContent("");
      const aiMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
      };
      const finalSummary = [...updatedSummary, aiMessage];

      const interval = setInterval(() => {
        setPartialContent((prev) => prev + words[currentWord] + " ");
        currentWord++;

        if (currentWord >= words.length) {
          clearInterval(interval);
          setSummary(finalSummary);
          setPartialContent("");
          setLoading(false);
        }
      }, 30);
      await updateNote(user.uid, noteId || newNoteId, finalSummary);
    } catch (error) {
      setError(handleAnthropicError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const onGenerateFlashcards = async () => {
    setInputError(null);
    if (numberOfCards < 20 || numberOfCards > 40) {
      setInputError("Please enter a number between 20 and 40");
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
    <div className="new-note__wrapper">
      <Layout userName={userName} />
      <div className="new-note__container">
        <div className="new-note__file">
          <FileUploadProcessor
            onExtractedText={(text, fileName, setDisplayFileName, setStatus) =>
              setFileUploadProps({
                text,
                fileName,
                setDisplayFileName,
                setStatus,
              })
            }
          />
          <div className="new-note__title">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter a title for your notes"
              id="title"
              value={title}
              onChange={onChange}
              required
            />
          </div>
          <Button
            variant="orange"
            disabled={!fileUploadProps.text || !isTitleValid || loading}
            onClick={() => onSubmit(fileUploadProps)}
          >
            {loading ? "Generating summary..." : "Generate summary"}
          </Button>
        </div>
        {isResponseGenerated && (
          <div className="note-summary__container">
            {error && <ErrorState />}
            {loading && <TypingIndicator />}
            {loading
              ? ""
              : summary.length > 0 &&
                summary.map(
                  (obj) =>
                    obj.role === "assistant" && (
                      <div key={obj.id} className={`note-summary ${obj.role}`}>
                        <div ref={aiMessageRef}>
                          <MarkdownRenderer>{obj.content}</MarkdownRenderer>
                        </div>
                      </div>
                    )
                )}
            {partialContent && (
              <div>
                <MarkdownRenderer>{partialContent}</MarkdownRenderer>
              </div>
            )}
          </div>
        )}
        {isResponseGenerated && !loading && (
          <div className="action-buttons-wrapper">
            <button
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
            </button>

            <button
              className="action-button"
              title="Create flashcards"
              onClick={handleCreateFlashcards}
            >
              <span>
                <StyleOutlinedIcon style={{ fontSize: ".85rem" }} />
                Flashcards
              </span>
            </button>
            <button
              className="action-button"
              title="Create quiz"
              onClick={handleCreateQuiz}
            >
              <span>
                <QuizOutlinedIcon style={{ fontSize: ".85rem" }} />
                Quiz
              </span>
            </button>
          </div>
        )}
      </div>
      {createFlashcards && (
        <>
          <div ref={inputSectionRef} style={{ height: "4rem" }} />
          <div className="input-wrapper notes">
            <p className="input-title">{`Generate flashcards from: \n ${topic.toUpperCase()}`}</p>
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
              onClick={() => onGenerateFlashcards(topic, numberOfCards)}
            >
              {loading ? "Generating Flashcards..." : "Generate Flashcards"}
            </Button>
          </div>
          <div className="flashcards-container regular">
            <div className="deck-wrapper">
              <div ref={cardStackRef} style={{ height: "6rem" }} />
              {loading && (
                <div className="deck-wrapper__loading">
                  <TypingIndicator />
                </div>
              )}
              {!loading && deck.length > 0 && (
                <>
                  <h1>{deck[0].topic.toUpperCase()}</h1>
                  <CardStack cards={deck} />
                </>
              )}
              {error && <ErrorState />}
            </div>
          </div>
        </>
      )}
      {/* {createQuiz && (
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
                  <TypingIndicator />
              )}
              {!loading && deck.length > 0 && (
                <>
                  <h1>{deck[0].topic.toUpperCase()}</h1>
                  <CardStack cards={deck} />
                </>
              )}
              {error && (
                <ErrorState/>
                </div>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default NewNote;
