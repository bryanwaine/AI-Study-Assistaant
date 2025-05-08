import { useEffect, useState } from "react";
import { useLocation, Navigate, Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import firstNameFilter from "../../utils/firstNameFilter";
import Layout from "../../components/Layout";
import handleGreeting from "../../utils/greetingHandler";
import Button from "../../components/Button/Button";
import { NavigateNext } from "@mui/icons-material";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import Loader from "../../components/Loader/Loader";
import { getAllDecks } from "../../utils/flashcardService";
import { getAllNotes } from "../../utils/noteService";
import "./Dashboard.css";
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const location = useLocation();
  const userName = user?.displayName || location.state?.userName;

  useEffect(() => {
    const fetchData = async (fetchFn, setter) => {
      try {
        const data = await fetchFn(user.uid);
        setter(data);
      } catch (error) {
        setError(handleAnthropicError(error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(getAllNotes, setNotes);
    fetchData(getAllSessions, setSessions);
    fetchData(getAllDecks, setFlashcards);
  }, [user]);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Layout userName={userName} />
      <div className="dashboard-wrapper">
        <h1>Dashboard</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="dashboard-container">
            <section className="card--blue">
              <h2>{handleGreeting(firstNameFilter(userName))}</h2>
              <p className="dashboard-message">
                Here's an overview of your study progress:
              </p>
              <div className="dashboard-overview">
                <Link to="/sessions" className="link">
                  <div className="dashboard-item card--white">
                    <span className="dashboard-label">Sessions</span>
                    <span className="dashboard-value">{sessions.length}</span>
                  </div>
                </Link>
                <Link to="/notes" className="link">
                  <div className="dashboard-item card--white">
                    <span className="dashboard-label">Notes</span>
                    <span className="dashboard-value">{notes.length}</span>
                  </div>
                </Link>
                <Link to="/decks" className="link">
                  <div className="dashboard-item card--white">
                    <span className="dashboard-label">Decks</span>
                    <span className="dashboard-value">{flashcards.length}</span>
                  </div>
                </Link>
                <Link to="/quizzes" className="link">
                  <div className="dashboard-item card--white">
                    <span className="dashboard-label">Quizzes</span>
                    <span className="dashboard-value">0</span>
                  </div>
                </Link>
              </div>
              <Button variant="orange">
                <Link to="/new-session" className="btn--link">
                  New Session
                </Link>
              </Button>
            </section>
            <section className="card--blue">
              <h2>Quick Links</h2>
              <div className="dashboard-quicklinks">
                <Link to="/new-session" className="link quicklink">
                  <p>Ask a Question</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-note" className="link quicklink">
                  <p>Create a Note</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-quiz" className="link quicklink">
                  <p>Take a Quiz</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-deck" className="link quicklink">
                  <p>Create a deck of Flashcards</p>
                  <NavigateNext />
                </Link>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
