import { Link, useLocation } from "react-router";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import { getAllDecks } from "../../utils/flashcardService";
import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Decks.css";

const Decks = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        const data = await getAllDecks(user.uid);
        setFlashcards(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [user]);

  return (
    <div className="decks__wrapper">
      <Layout userName={userName} />
      <div className="decks__container">
        <h1>Your Flashcards</h1>
        <Button variant="orange">
          <Link to="/new-deck" className="btn--link">
            New Flashcards
          </Link>
        </Button>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : flashcards.length === 0 ? (
          <EmptyState page="flashcards" />
        ) : (
          <ul className="decks">
            {sortFlashcardsByTime(flashcards).map((deck) => (
              <Link to={deck.id} key={deck.id}>
                <li className="deck card--blue">
                  <h2>{deck.metadata.title.toUpperCase()}</h2>
                  <div className="deck-footer">
                    <div className="deck-footer-left">
                      <p>
                        <span>Created</span>
                        {formatFirebaseTimestamp(deck.metadata.createdAt)}
                      </p>
                    </div>
                    <div className="deck-footer-right">
                      <p>{`${deck.metadata.cardCount} flashcards`} </p>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Decks;
