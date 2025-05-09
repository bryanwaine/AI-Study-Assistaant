import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import "./Decks.css";

import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import { getAllDecks } from "../../utils/flashcardService";
import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";

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
          <ul className="decks__list">
            {sortFlashcardsByTime(flashcards).map((deck) => (
              <li key={deck.id}>
                <Link to={deck.id} className="deck-card card--blue">
                  <h2 className="deck-card__title">
                    {deck.metadata.title.toUpperCase()}
                  </h2>
                  <div className="deck-card__metadata-container">
                    <div className="deck-card__metadata-left">
                      <p className="deck-card__metadata">
                        <span className="deck-card__metadata-item">
                          Created
                        </span>
                        {formatFirebaseTimestamp(deck.metadata.createdAt)}
                      </p>
                    </div>
                    <div className="deck-card__metadata-right">
                      <p className="deck-card__metadata">
                        {`${deck.metadata.cardCount} flashcards`}{" "}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Decks;
