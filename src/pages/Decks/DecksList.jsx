import React from "react";

import { Link } from "react-router";

import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";

const DecksList = ({ flashcards }) => {
  return (
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
                  <span className="deck-card__metadata-item">Created</span>
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
  );
};

export default DecksList;
