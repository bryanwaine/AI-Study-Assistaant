import { Suspense, useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import NotesList from "./NotesList";
import ErrorState from "../../components/ErrorState/ErrorState";
import Layout from "../../components/Layout";
import EmptyState from "../../components/EmptyState/EmptyState";
import Button from "../../components/Button/Button";
import SessionsListSkeleton from "../../components/Skeleton/SessionsListSkeleton";
import BubbleBackground from "../../components/BubbleBg";
import useAuth from "../../hooks/useAuth";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllNotes } from "../../utils/noteService";

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

  useEffect(() => {
    const options = {
      threshold: 0.2,
    };
    const slideCallback = (entries, slideObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          slideObserver.unobserve(entry.target);
        }
      });
    };

    const slideObserver = new IntersectionObserver(slideCallback, options);

    const fadeCallback = (entries, fadeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          fadeObserver.unobserve(entry.target);
        }
      });
    };

    const fadeObserver = new IntersectionObserver(fadeCallback, options);

    const slideAnimatedElements = document.querySelectorAll(".animate-slide");
    slideAnimatedElements.forEach((el) => slideObserver.observe(el));

    const fadeAnimatedElements = document.querySelectorAll(".animate-fade");
    fadeAnimatedElements.forEach((el) => fadeObserver.observe(el));
  });

  return (
    <div className="notes__wrapper">
      <Layout userName={userName} />
      <BubbleBackground />
      <div className="notes__container">
        <h1 className="animate-fade dark:text-gray-100 text-3xl md:text-5xl !mb-6">
          Your Notes
        </h1>
        <Button variant="orange">
          <Link to="/new-note" className="btn--link">
            New Note
          </Link>
        </Button>
        <div className="animate-slide sessions__list">
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
    </div>
  );
};

export default Notes;
