import { Link, useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllSessions } from "../utils/sessionService";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import formatFirebaseTimestamp from "../utils/formatFirebaseTimestamp";
import sortDataByTime from "../utils/sortDataByTime";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getAllSessions(user.uid);
        setSessions(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <>
      <Layout userName={userName}  />
      <div className="sessions-container">
        <h1>Your Sessions</h1>
        <Button variant="orange">
          <Link to="/new-session" className="btn--link">
            New Session
          </Link>
        </Button>
        <ul className="sessions">
          {loading ? (
            <Loader />
          ) : error ? (
            <p>{error}</p>
          ) : (
            sortDataByTime(sessions).map((session) => (
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
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default Sessions;
