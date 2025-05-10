import { useEffect, useState } from "react";

import { Link, useLocation } from "react-router";

import "./Sessions.css";

import EmptyState from "../../components/EmptyState/EmptyState";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import sortSessionsByTime from "../../utils/sortSessionsByTime";

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
    <div div className="sessions__wrapper">
      <Layout userName={userName} />
      <div className="sessions__container">
        <h1>Your Sessions</h1>
        <Button variant="orange" >
          <Link to="/new-session" className="btn--link">
            New Session
          </Link>
        </Button>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : sessions.length === 0 ? (
          <EmptyState page="sessions" />
        ) : (
          <ul className="sessions__list">
            {sortSessionsByTime(sessions).map((session) => (
              <li key={session.id}>
                <Link to={session.id} className="session-card card--blue">
                  <h2 className="session-card__title">
                    {session.metadata.title}
                  </h2>
                  <div className="session-card__metadata-container">
                    <div className="session-card__metadata-left">
                      <p className="session-card__metadata">
                        <span className="session-card__metadata-item">
                          Created
                        </span>
                        {formatFirebaseTimestamp(session.metadata.createdAt)}
                      </p>
                      <p className="session-card__metadata">
                        <span className="session-card__metadata-item">
                          Updated
                        </span>
                        {formatFirebaseTimestamp(session.metadata.updatedAt)}
                      </p>
                    </div>
                    <div className="session-card__metadata-right">
                      <p className="session-card__metadata">
                        {session.metadata.messageCount}
                        {session.metadata.messageCount === 1
                          ? " message"
                          : " messages"}
                      </p>
                    </div>
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

export default Sessions;
