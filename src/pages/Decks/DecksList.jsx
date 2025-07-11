import React from "react";

import { Link } from "react-router";

import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import useStaggeredAnimation from "../../hooks/useStaggeredAnimation";

const DecksList = ({ flashcards }) => {
  useStaggeredAnimation({
    selector: ".animate-slide",
    animationClass: "slide-up",
    threshold: 0.2,
    staggerDelay: 50,
  });

  useStaggeredAnimation({
    selector: ".animate-fade",
    animationClass: "fade-in",
    threshold: 0.2,
    staggerDelay: 50,
  });

  return (
    <ul className="decks__list">
      {sortFlashcardsByTime(flashcards).map((deck) => (
        <li key={deck.id}>
          <Link
            to={deck.id}
            className="deck-card bg-gray-900/10 dark:bg-gray-100/10 rounded-xl"
          >
            <h2 className="deck-card__title text-sky-900 dark:text-sky-400">
              {deck.metadata.title.toUpperCase()}
            </h2>
            <div className="deck-card__metadata-container">
              <div className="deck-card__metadata-left">
                <p className="deck-card__metadata text-neutral-900 dark:text-neutral-100">
                  <span className="deck-card__metadata-item text-sky-900 dark:text-sky-400">
                    Created
                  </span>
                  {formatFirebaseTimestamp(deck.metadata.createdAt)}
                </p>
              </div>
              <div className="deck-card__metadata-right">
                <p className="deck-card__metadata text-neutral-900 dark:text-neutral-100">
                  {`${deck.metadata.cardCount} flashcards`}{" "}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default DecksList;
