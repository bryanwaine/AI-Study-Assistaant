import { Suspense, useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import NotesList from "./NotesList";
import ErrorState from "../../components/ErrorState/ErrorState";
import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState/EmptyState";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllNotes } from "../../utils/noteService";
import SessionsListSkeleton from "../../components/Skeleton/SessionsListSkeleton";

import "./Notes.css";

/**
 * Notes component displays a list of user's notes.
 * It fetches notes from the database using the user's ID and displays them in a sorted list.
 * The component also handles loading and error states.
 * Users can navigate to create a new note.
 */

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
        <Suspense fallback={<SessionsListSkeleton />}>
          {loading ? (
            <SessionsListSkeleton />
          ) : error ? (
             <ErrorState error={error} />
          ) : notes.length === 0 ? (
            <EmptyState page="notes" />
          ) : (
            <NotesList notes={notes} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Notes;
