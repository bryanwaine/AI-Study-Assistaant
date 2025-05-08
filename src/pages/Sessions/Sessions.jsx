import { Link, useLocation } from "react-router";
import Layout from "../../components/Layout";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import formatFirebaseTimestamp from "../../utils/formatFirebaseTimestamp";
import sortSessionsByTime from "../../utils/sortSessionsByTime";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Sessions.css";

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
        <Button variant="orange">
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
          <ul className="sessions">
            {sortSessionsByTime(sessions).map((session) => (
              <Link to={session.id} key={session.id}>
                <li className="session card--blue">
                  <h2>{session.metadata.title}</h2>
                  <div className="session-footer">
                    <div className="session-footer-left">
                      <p>
                        <span>Created</span>
                        {formatFirebaseTimestamp(session.metadata.createdAt)}
                      </p>
                      <p>
                        <span>Updated</span>
                        {formatFirebaseTimestamp(session.metadata.updatedAt)}
                      </p>
                    </div>
                    <div className="session-footer-right">
                      <p>
                        {session.metadata.messageCount}
                        {session.metadata.messageCount === 1
                          ? " message"
                          : " messages"}
                      </p>
                    </div>
                  </div>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sessions;
