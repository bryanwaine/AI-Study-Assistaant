import { Link, useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import formatFirebaseTimestamp from "../utils/formatFirebaseTimestamp";
import sortDataByTime from "../utils/sortDataByTime";
import { getAllDecks } from "../utils/flashcardService";

const Decks = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchDecks = async () => {
      setLoading(true);
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
  }, []);

  return (
    <>
      <Layout userName={userName} />
      <div className="sessions-container">
        <h1>Your Flashcards</h1>
        <Button variant="orange">
          <Link to="/new-deck" className="btn--link">
            New Flashcards
          </Link>
        </Button>
        <ul className="sessions">
          {loading ? (
            <Loader />
          ) : error ? (
            <p>{error}</p>
          ) : (
            sortDataByTime(flashcards).map((deck) => (
              <Link to={deck.id} key={deck.id}>
                <li className="session card--blue">
                  <h2>{deck.metadata.title.toUpperCase()}</h2>
                  <div className="session-footer">
                    <div className="session-footer-left">
                      <p>
                        <span>Created</span>
                        {formatFirebaseTimestamp(deck.metadata.createdAt)}
                      </p>
                    </div>
                    <div className="session-footer-right">
                      <p>{`${deck.metadata.cardCount} flashcards`} </p>
                    </div>
                  </div>
                </li>
              </Link>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Decks;
