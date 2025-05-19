import { useEffect, useRef, useState } from "react";

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
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import GenerateBtnGroup from "../Note/GenerateBtnGroup";
import GenerateFlashcards from "../../components/GenerateFlashcards/GenerateFlashcards";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { saveNote, updateNote } from "../../utils/noteService";
import { saveDeck } from "../../utils/flashcardService";

import "./NewNote.css";
import "../NewFlashcards/NewFlashcards.css";

const NewNote = () => {
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
  const [summary, setSummary] = useState([]);
  const [error, setError] = useState(null);
  const [flashcardError, setFlashcardError] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const [partialContent, setPartialContent] = useState("");
  const [fileUploadProps, setFileUploadProps] = useState({});
  const [generateFlashcards, setGenerateFlashcards] = useState(false);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [showBottomRef, setShowBottomRef] = useState(false);
  const [topic, setTopic] = useState("");
  const [flashcardTopic, setFlashcardTopic] = useState("");
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
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToInputSection = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [loadingFlashcards]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToInputSection();
  }, [generateFlashcards, generateQuiz]);

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

  const handleCopy = () => {
    if (aiMessageRef.current) {
      navigator.clipboard.writeText(aiMessageRef.current.textContent);
    }
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };

  const onInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleGenerateFlashcards = () => {
    setGenerateQuiz(false);
    setGenerateFlashcards(true);
    setFlashcardTopic(topic.toUpperCase());
  };

  const handleGenerateQuiz = () => {
    setGenerateFlashcards(false);
    setGenerateQuiz(true);
    setFlashcardTopic(topic.toUpperCase());
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
      setLoadingSummary(true);
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
          setLoadingSummary(false);
        }
      }, 30);
      await updateNote(user.uid, noteId || newNoteId, finalSummary);
      setTitle("");
      setStatus(null);
      setDisplayFileName("");
    } catch (error) {
      setError(handleAnthropicError(error).message);
    } finally {
      setLoadingSummary(false);
    }
  };

  const onGenerateFlashcards = async () => {
    setInputError(null);
    if (numberOfCards < 20 || numberOfCards > 40) {
      setInputError("Please enter a number between 20 and 40");
      return;
    }
    setShowBottomRef(true);
    try {
      const cardTopic = topic;
      const cardCount = numberOfCards;
      setError(null);
      setLoadingFlashcards(true);
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
      setLoadingFlashcards(false);
    } catch (error) {
      console.log(error);
      setLoadingFlashcards(false);
      setFlashcardError(handleAnthropicError(error).message);
    }
  };

  return (
    <div className="new-note__wrapper">
      <Layout userName={userName} />
      <div className="new-note__container">
        <div className="new-note__file-upload__wrapper">
          <div className="new-note__file-upload__container card--white">
            <FileUploadProcessor
              onExtractedText={(
                text,
                fileName,
                setDisplayFileName,
                setStatus
              ) =>
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
              disabled={!fileUploadProps.text || !isTitleValid || loadingSummary}
              onClick={() => onSubmit(fileUploadProps)}
            >
              {loadingSummary ? "Generating summary..." : "Generate summary"}
            </Button>
          </div>
        </div>
        {loadingSummary && (
          <div className="note-summary__loading">
            <TypingIndicator />
          </div>
        )}
        {error && <ErrorState error={error} />}
        <div className="note-summary__wrapper">
          {isResponseGenerated && !loadingSummary && (
            <>
              <div className="note__title">{topic.toUpperCase()}</div>
              <div className="note-summary__container">
                {summary.length > 0 &&
                  summary.map(
                    (obj) =>
                      obj.role === "assistant" && (
                        <div
                          key={obj.id}
                          className={`note-summary ${obj.role}`}
                        >
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
              <ActionButtons isCopied={isCopied} handleCopy={handleCopy} />
              <GenerateBtnGroup
                isCopied={isCopied}
                handleCopy={handleCopy}
                handleGenerateFlashcards={handleGenerateFlashcards}
                handleGenerateQuiz={handleGenerateQuiz}
                generateFlashcards={generateFlashcards}
                generateQuiz={generateQuiz}
              />
            </>
          )}
          {generateFlashcards && (
            <GenerateFlashcards
              topic={flashcardTopic}
              deck={deck}
              numberOfCards={numberOfCards}
              setNumberOfCards={setNumberOfCards}
              inputError={inputError}
              loadingFlashcards={loadingFlashcards}
              onChange={onChange}
              onInput={onInput}
              onGenerateFlashcards={onGenerateFlashcards}
              inputSectionRef={inputSectionRef}
              flashcardError={flashcardError}
              cardStackRef={cardStackRef}
            />
          )}
          {showBottomRef && (
            <div ref={bottomRef} style={{ height: "1px", width: "100%" }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NewNote;
