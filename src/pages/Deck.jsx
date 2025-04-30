import { useLocation, useParams, Navigate } from "react-router";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import { getDeck } from "../utils/flashcardService";
import CardStack from "../components/Cardstack/CardStack";


const Deck = () => {
  const [deck, setDeck] = useState([]);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;
  const { deckId } = useParams();

  useEffect(() => {
    const fetchDeck = async () => {
      setFetching(true);
      try {
        const data = await getDeck(user.uid, deckId);
        // Assign IDs and shuffle if needed
        const flashcards = data.deck.map((card, index) => ({
          ...card,
          id: card.id || index + 1,
        }));
        setDeck(flashcards);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchDeck();
    }
  }, [deckId, user]);

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Layout userName={userName} />
      <div className="flashcards-container regular">
        <div className="deck-wrapper">
          {fetching && <Loader />}
          {error && (
            <div className="chat-error-container">
              <p className="error">Something went wrong. Please try again.</p>
            </div>
          )}
          {!fetching && deck.length > 0 &&
            <>
              <h1>{deck[0].topic}</h1>
              <CardStack cards={deck} />
            </>}
        </div>
      </div>
    </>
  );
};

export default Deck;
