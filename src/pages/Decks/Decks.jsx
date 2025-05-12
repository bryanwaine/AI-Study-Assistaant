import { Suspense, useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import "./Decks.css";

import DecksList from "./DecksList";
import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState/EmptyState";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllDecks } from "../../utils/flashcardService";
import SessionsListSkeleton from "../../components/Skeleton/SessionsListSkeleton";

/**
 * Decks component displays a list of user's flashcards.
 * It fetches flashcards from the database using the user's ID and displays them in a sorted list.
 * The component also handles loading and error states.
 * Users can navigate to create a new flashcard.
 */
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
         <Suspense fallback={<SessionsListSkeleton />}>
                  {loading ? (
                    <SessionsListSkeleton/>
                  ) : error ? (
                    <p className="error">{error}</p>
                  ) : flashcards.length === 0 ? (
                    <EmptyState page="flashcards" />
                  ) : (
                    <DecksList flashcards={flashcards} />
                  )}
                </Suspense>
      </div>
    </div>
  );
};

export default Decks;
