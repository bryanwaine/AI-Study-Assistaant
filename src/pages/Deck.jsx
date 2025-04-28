import { useLocation, useParams } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useRef, useState } from "react";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import { getDeck } from "../utils/flashcardService";

const Deck = () => {
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFrontCardVisible, setIsFrontCardVisible] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const params = useParams();
  const endRef = useRef(null);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        const data = await getDeck(user.uid, params.deckId);
        setDeck(data.deck);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(handleAnthropicError(error).message);
      }
    };

    fetchDeck();
  }, [params.sessionId]);

  useEffect(() => {
    scrollToBottom();
    setIsFrontCardVisible("yes");
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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

  return (
    <>
      <Layout userName={userName} />
      <div className="flashcards-container regular">
        <div className="deck-wrapper">
          {loading && <Loader />}
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
                  <span className="card-number-top">{card.id}</span>
                  <h2>{card.topic.toUpperCase()}</h2>
                  <span className="card-question">Question</span>
                  <h3>{card.question}</h3>
                  <span className="card-number-bottom">{card.id}</span>
                  <span className="card-toggle">Tap to flip</span>
                </div>
                <div
                  className="back"
                  onClick={() => {
                    flipCard();
                    trackCardFace();
                  }}
                >
                  <span className="card-number-top">{card.id}</span>
                  <span className="card-answer">Answer</span>
                  <p>{card.answer}</p>
                  <span className="card-number-bottom">{card.id}</span>
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
        <div ref={endRef} />
      </div>
    </>
  );
};

export default Deck;
