import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import { getAllNotes } from "../../utils/noteService";

import "./Notes.css";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getAllNotes(user.uid);
        setNotes(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  return (
    <div className="notes__wrapper">
      <Layout userName={userName} />
      <div className="notes__container">
        <h1>Your Notes</h1>
        <Button variant="orange">
          <Link to="/new-note" className="btn--link">
            New Note
          </Link>
        </Button>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : notes.length === 0 ? (
          <EmptyState page="notes" />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default Notes;
