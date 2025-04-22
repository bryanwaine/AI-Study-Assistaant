import { Link, useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getAllSessions } from "../utils/SessionService";
import handleAnthropicError from "../utils/anthropicErrorHandler";
import Loader from "../components/Loader";
import Button from "../components/Button";
import formatFirebaseTimestamp from "../utils/formatTimestamp";
import useToast from "../hooks/useToast";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const { showToast } = useToast();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const data = await getAllSessions(user.uid);
        setSessions(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
        showToast(error, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <>
      <Layout userName={userName} />
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
            sessions.map((session) => (
              <Link to={session.id} key={session.id}>
                <li className="session card--blue">
                  <h2>{session.metadata.title}</h2>

                  <p>
                    <span>Last updated:</span>
                    {formatFirebaseTimestamp(session.metadata.updatedAt)}
                  </p>
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
