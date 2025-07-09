import { Suspense, useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import SessionsList from "./SessionsList";
import EmptyState from "../../components/EmptyState/EmptyState";
import Button from "../../components/Button/Button";
import Layout from "../../components/Layout";
import SessionsListSkeleton from "../../components/Skeleton/SessionsListSkeleton";
import ErrorState from "../../components/ErrorState/ErrorState";
import BubbleBackground from "../../components/BubbleBg";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";

import "./Sessions.css";

/**
 * Sessions component displays a list of user's sessions.
 * It fetches sessions from the database using the user's ID and displays them in a sorted list.
 * The component also handles loading and error states.
 * Users can navigate to create a new session.
 */
const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await getAllSessions(user.uid);
        setSessions(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSessions();
    }
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
    <>
      <Layout userName={userName} />
      <div className="sessions__wrapper">
        <BubbleBackground />
        <div className="sessions__container">
          <h1 className="animate-fade dark:text-gray-100 text-3xl md:text-5xl !mb-6">
            Your Sessions
          </h1>
          <Button variant="orange">
            <Link to="/new-session" className="btn--link">
              New Session
            </Link>
          </Button>
          <div className="animate-slide sessions__list">
            <Suspense fallback={<SessionsListSkeleton />}>
              {loading ? (
                <SessionsListSkeleton />
              ) : error ? (
                <ErrorState error={error} />
              ) : sessions.length === 0 ? (
                <EmptyState page="sessions" />
              ) : (
                <SessionsList sessions={sessions} />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sessions;
