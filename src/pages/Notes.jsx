import { Link, useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import formatFirebaseTimestamp from "../utils/formatFirebaseTimestamp";
import sortFlashcardsByTime from "../utils/sortFlashcardsByTime";
import { getAllNotes } from "../utils/noteService";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
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
      <div className="sessions-container">
        <h1>Your Notes</h1>
        <Button variant="orange">
          <Link to="/new-note" className="btn--link">
            New Note
          </Link>
        </Button>
        {notes.length === 0 ? (
          <div className="empty-placeholder">
            <DescriptionOutlinedIcon />
            <h2>You don't have any notes yet.</h2>
            <p>When you do, they will show up here</p>
          </div>
        ) : (
          <ul className="sessions">
            {loading ? (
              <Loader />
            ) : error ? (
              <p>{error}</p>
            ) : (
              sortFlashcardsByTime(notes).map((note) => (
                <Link to={note.id} key={note.id}>
                  <li className="session card--blue">
                    <h2>{note.metadata.title.toUpperCase()}</h2>
                    <div className="session-footer">
                      <div className="session-footer-left">
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
              ))
            )}
          </ul>
        )}
      </div>
    </>
  );
};

export default Notes;
