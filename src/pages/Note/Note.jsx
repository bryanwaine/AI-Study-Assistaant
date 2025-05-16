import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { useLocation, useParams } from "react-router";

import GenerateBtnGroup from "./GenerateBtnGroup";
import ErrorState from "../../components/ErrorState/ErrorState";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { saveDeck } from "../../utils/flashcardService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getNote } from "../../utils/noteService";
import NoteContainerSkeleton from "../../components/Skeleton/NoteContainerSkeleton";
import { generateFlashcardsFromNotes } from "../../anthropic";

import "./Note.css";
import "../NewFlashcards/NewFlashcards.css";
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import GenerateFlashcards from "../../components/GenerateFlashcards/GenerateFlashcards";

// Lazy loaded components
const NoteContainer = lazy(() => import("./NoteContainer"));

const Note = () => {
  const [fetching, setFetching] = useState(false);
  const [summary, setSummary] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [error, setError] = useState(null);
  const [flashcardError, setFlashcardError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const [deck, setDeck] = useState([]);
  const [numberOfCards, setNumberOfCards] = useState("");
  const [inputError, setInputError] = useState(null);
  ("");
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");
  const [generateFlashcards, setGenerateFlashcards] = useState(false);
  const [generateQuiz, setGenerateQuiz] = useState(false);
  const [showBottomRef, setShowBottomRef] = useState(false);

  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const { noteId } = useParams();
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
  }, [loading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToInputSection();
  }, [generateFlashcards, generateQuiz]);


  useEffect(() => {
    const fetchNote = async () => {
      setFetching(true);
      try {
        const data = await getNote(user.uid, noteId);
        setSummary(data.summary);
        setMetaData(data.metadata);
        setNotes(data.summary[0].content);
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
    if (name === "numberOfCards") {
      setNumberOfCards(value);
    }
  };

  const onInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  const handleCreateFlashcards = () => {
    setGenerateQuiz(false);
    setGenerateFlashcards(true);
    setTopic(metaData.title.toUpperCase());
  };

  const handleCreateQuiz = () => {
    setGenerateFlashcards(false);
    setGenerateQuiz(true);
    setTopic(metaData.title.toUpperCase());
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
      setNumberOfCards("");
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
      setFlashcardError(handleAnthropicError(error).message);
    }
  };

  return (
    <div className="note__wrapper">
      <Layout userName={userName} />
      <Suspense fallback={<NoteContainerSkeleton />}>
        {fetching ? (
          <NoteContainerSkeleton />
        ) : error ? (
          <ErrorState error={error} />
        ) : (
          <>
            <NoteContainer
              summary={summary}
              metaData={metaData}
              notes={notes}
              error={error}
            />
            <ActionButtons isCopied={isCopied} handleCopy={handleCopy} />
            <GenerateBtnGroup
              isCopied={isCopied}
              handleCopy={handleCopy}
              handleCreateFlashcards={handleCreateFlashcards}
              handleCreateQuiz={handleCreateQuiz}
            />
          </>
        )}
      </Suspense>
      {generateFlashcards && (
        <GenerateFlashcards
          topic={topic}
          deck={deck}
          numberOfCards={numberOfCards}
          setNumberOfCards={setNumberOfCards}
          inputError={inputError}
          loading={loading}
          onChange={onChange}
          onInput={onInput}
          onSubmit={onSubmit}
          inputSectionRef={inputSectionRef}
          flashcardError={flashcardError}
          cardStackRef={cardStackRef}
        />
      )}
      {showBottomRef && <div ref={bottomRef} style={{ height: "1px", width: "100%" }} />}
    </div>
  );
};

export default Note;
