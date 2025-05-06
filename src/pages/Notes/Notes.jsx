import { Link, useLocation } from "react-router";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import sortFlashcardsByTime from "../../utils/sortFlashcardsByTime";
import { getAllNotes } from "../../utils/noteService";
import EmptyState from "../../components/EmptyState/EmptyState";
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
    <>
      <Layout userName={userName} />
      <div className="notes-container">
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
          <ul className="notes">
            {sortFlashcardsByTime(notes).map((note) => (
              <Link to={note.id} key={note.id}>
                <li className="note card--blue">
                  <h2>{note.metadata.title.toUpperCase()}</h2>
                  <div className="note-footer">
                    <div className="note-footer-left">
                      <p>
                        <span>File</span>
                        {note.metadata.fileName || ""}
                      </p>
                      <p>
                        <span>Created</span>
                        {formatFirebaseTimestamp(note.metadata.createdAt)}
                      </p>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notes;
