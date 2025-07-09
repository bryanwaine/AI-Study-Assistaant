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
import ActionButtons from "../../components/ActionButtons/ActionButtons";
import GenerateFlashcards from "../../components/GenerateFlashcards/GenerateFlashcards";
import { generateFlashcardsFromNotes } from "../../anthropic";

import "./Note.css";
import "../NewFlashcards/NewFlashcards.css";

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
  const [flashcardTopic, setFlashcardTopic] = useState("");
  const [loadingFlashcards, setLoadingFlashcards] = useState(false);
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
  }, [loadingFlashcards]);

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

  useEffect(() => {
      const callback = (entries, slideObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-up");
            slideObserver.unobserve(entry.target);
          }
        });
      };
  
      const options = {
        threshold: 0.2,
      };
  
      const slideObserver = new IntersectionslideObserver(callback, options);
  
      const slideAnimatedElements = document.querySelectorAll(".animate-slide");
      slideAnimatedElements.forEach((el) => slideObserver.observe(el));
    });

  if (!user) return <Navigate to="/login" replace />;

  const onChange = (e) => {
    const { name, value } = e.target;
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
    setFlashcardTopic(metaData.title.toUpperCase());
  };

  const handleGenerateQuiz = () => {
    setGenerateFlashcards(false);
    setGenerateQuiz(true);
    setFlashcardTopic(metaData.title.toUpperCase());
  };

  const onGenerateFlashcards = async () => {
    setInputError(null);
    if (numberOfCards < 20 || numberOfCards > 40) {
      setInputError("Please enter a number between 20 and 40");
      return;
    }
    setShowBottomRef(true);
    try {
      const cardTopic = flashcardTopic;
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
              handleGenerateFlashcards={handleGenerateFlashcards}
                  handleGenerateQuiz={handleGenerateQuiz}
                  generateFlashcards={generateFlashcards}
                  generateQuiz={generateQuiz}
            />
          </>
        )}
      </Suspense>
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
      {showBottomRef && <div ref={bottomRef} style={{ height: "1px", width: "100%" }} />}
    </div>
  );
};

export default Note;
