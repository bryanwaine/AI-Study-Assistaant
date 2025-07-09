import React, { useEffect, useState } from "react";

import { useLocation, useParams, Navigate } from "react-router";

import "./Deck.css";

import CardStack from "../../components/Cardstack/CardStack";
import ErrorState from "../../components/ErrorState/ErrorState";
import Layout from "../../components/Layout";
import Loader from "../../components/Loader/Loader";
import { getDeck } from "../../utils/flashcardService";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";

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

    const slideObserver = new IntersectionObserver(callback, options);

    const slideAnimatedElements = document.querySelectorAll(".animate-slide");
    slideAnimatedElements.forEach((el) => slideObserver.observe(el));
  });

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flashcards__wrapper">
      <Layout userName={userName} />
      <div className="animate-slide flashcards__container">
        <div className="deck__wrapper">
          {fetching && <Loader />}
          {error && <ErrorState />}
          {!fetching && deck.length > 0 && (
            <>
              <h1 className="dark:text-gray-100">
                {deck[0]?.topic.toUpperCase()}
              </h1>
              <CardStack cards={deck} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deck;
