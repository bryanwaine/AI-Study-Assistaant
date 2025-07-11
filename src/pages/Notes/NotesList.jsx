import React from "react";

import { Link } from "react-router";

import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import useStaggeredAnimation from "../../hooks/useStaggeredAnimation";

const NotesList = ({ notes }) => {
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
    <ul className="notes__list">
      {sortFlashcardsByTime(notes).map((note) => (
        <li key={note.id} >
          <Link
            to={note.id}
            className="session-card bg-gray-900/10 dark:bg-gray-100/10 rounded-xl"
          >
            <h2 className="session-card__title text-sky-900 dark:text-sky-400">
              {note.metadata.title.toUpperCase()}
            </h2>
            <div className="note-card__metadata-container">
              <p className="note-card__metadata text-neutral-900 dark:text-neutral-100">
                <span className="note-card__metadata-item text-sky-900 dark:text-sky-400">
                  File
                </span>
                {note.metadata.fileName || ""}
              </p>
              <p className="note-card__metadata text-neutral-900 dark:text-neutral-100">
                <span className="note-card__metadata-item text-sky-900 dark:text-sky-400">
                  Created
                </span>
                {formatFirebaseTimestamp(note.metadata.createdAt)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default NotesList;
