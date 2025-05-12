import { Suspense, useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import SessionsList from "./SessionsList";
import EmptyState from "../../components/EmptyState/EmptyState";
import Button from "../../components/Button/Button";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import SessionsListSkeleton from "../../components/Skeleton/SessionsListSkeleton";

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

  return (
    <div className="sessions__wrapper">
      <Layout userName={userName} />
      <div className="sessions__container">
        <h1>Your Sessions</h1>
        <Button variant="orange" >
          <Link to="/new-session" className="btn--link">
            New Session
          </Link>
        </Button>
        <Suspense fallback={<SessionsListSkeleton />}>
          {loading ? (
            <SessionsListSkeleton/>
          ) : error ? (
            <p className="error">{error}</p>
          ) : sessions.length === 0 ? (
            <EmptyState page="sessions" />
          ) : (
            <SessionsList sessions={sessions} />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Sessions;
