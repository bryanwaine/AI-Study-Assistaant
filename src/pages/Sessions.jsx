import { useLocation } from "react-router";
import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";
import { use, useEffect, useState } from "react";
import { getAllSessions } from "../utils/SessionService";
import handleAnthropicError from "../utils/anthropicErrorHandler";

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

    console.log("sessions", sessions);

  return (
    <>
      <Layout userName={userName} />
      <div className="sessions-container">
              <h1>Sessions</h1>
              {/* <div className="sessions">
                  {loading ? (
                      <p>Loading...</p>
                  ) : error ? (
                      <p>{error}</p>
                  ) : (
                      sessions.map((session) => (
                          <div key={session.id} className="session">
                              <h2>{session.title}</h2>
                              <p>{session.content}</p>
                          </div>
                      ))
                  )}
              </div> */}
      </div>
    </>
  );
};

export default Sessions;
