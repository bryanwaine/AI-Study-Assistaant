import React from 'react'

import { Link } from 'react-router'

import sortFlashcardsByTime from '../../utils/sortFlashcardsByTime'
import formatFirebaseTimestamp from '../../utils/formatFirebaseTimestamp'

const NotesList = ({ notes }) => {
  return (
    <ul className="notes__list">
            {sortFlashcardsByTime(notes).map((note) => (
              <li key={note.id}>
                <Link to={note.id} className="note-card card--blue">
                  <h2 className="note-card__title">
                    {note.metadata.title.toUpperCase()}
                  </h2>
                  <div className="note-card__metadata-container">
                    <p className="note-card__metadata">
                      <span className="note-card__metadata-item">File</span>
                      {note.metadata.fileName || ""}
                    </p>
                    <p className="note-card__metadata">
                      <span className="note-card__metadata-item">Created</span>
                      {formatFirebaseTimestamp(note.metadata.createdAt)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
  )
}

export default NotesList