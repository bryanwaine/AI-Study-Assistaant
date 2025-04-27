import { Link, useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllSessions } from "../utils/sessionService";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import formatFirebaseTimestamp from "../utils/formatFirebaseTimestamp";
import sortSessionsByTime from "../utils/sortSessionsByTime";

const Sessions = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getAllSessions(user.uid);
        setFlashcards(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <>
      <Layout userName={userName}  />
      <div className="sessions-container">
        <h1>Your Flashcards</h1>
        <Button variant="orange">
          <Link to="/new-flashcards" className="btn--link">
            New Flashcards
          </Link>
        </Button>
        <ul className="sessions">
          {loading ? (
            <Loader />
          ) : error ? (
            <p>{error}</p>
          ) : (
            sortSessionsByTime(flashcards).map((deck) => (
              <Link to={deck.id} key={deck.id}>
                <li className="session card--blue">
                  <h2>{deck.metadata.title}</h2>
                  <div className="session-footer">
                    <div className="session-footer-left">
                      <p>
                        <span>Created</span>
                        {formatFirebaseTimestamp(deck.metadata.createdAt)}
                      </p>
                      <p>
                        <span>Updated</span>
                        {formatFirebaseTimestamp(deck.metadata.updatedAt)}
                      </p>
                    </div>
                    <div className="session-footer-right">
                      <p>
                        {deck.metadata.messageCount}
                        {deck.metadata.messageCount === 1
                          ? " flashcard"
                          : " flashcards"}
                      </p>
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

export default Sessions;
