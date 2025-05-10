import { useEffect, useState } from "react";

import { useLocation, Navigate, Link } from "react-router";
import { NavigateNext } from "@mui/icons-material";

import "./Dashboard.css";

import Layout from "../../components/Layout";
import Loader from "../../components/Loader/Loader";
import Button from "../../components/Button/Button";
import useAuth from "../../hooks/useAuth";
import firstNameFilter from "../../utils/firstNameFilter";
import handleGreeting from "../../utils/greetingHandler";
import { getAllSessions } from "../../utils/sessionService";
import handleAnthropicError from "../../utils/anthropicErrorHandler";
import { getAllDecks } from "../../utils/flashcardService";
import { getAllNotes } from "../../utils/noteService";
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
      <div className="dashboard__wrapper">
        <h1>Dashboard</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="dashboard__container">
            <section className="dashboard-card card--blue">
              <h2 className="dashboard-card__greeting">
                {handleGreeting(firstNameFilter(userName))}
              </h2>
              <p className="dashboard-card__message">
                Here's an overview of your study progress:
              </p>
              <div className="dashboard-card__overview">
                <Link to="/sessions" className="link">
                  <div className="dashboard-card__item card--white">
                    <span className="dashboard-card__item-label">Sessions</span>
                    <span className="dashboard-card__item-value">
                      {sessions.length}
                    </span>
                  </div>
                </Link>
                <Link to="/notes" className="link">
                  <div className="dashboard-card__item card--white">
                    <span className="dashboard-card__item-label">Notes</span>
                    <span className="dashboard-card__item-value">
                      {notes.length}
                    </span>
                  </div>
                </Link>
                <Link to="/decks" className="link">
                  <div className="dashboard-card__item card--white">
                    <span className="dashboard-card__item-label">Decks</span>
                    <span className="dashboard-card__item-value">
                      {flashcards.length}
                    </span>
                  </div>
                </Link>
                <Link to="/quizzes" className="link">
                  <div className="dashboard-card__item card--white">
                    <span className="dashboard-card__item-label">Quizzes</span>
                    <span className="dashboard-card__item-value">0</span>
                  </div>
                </Link>
              </div>
              <Button variant="orange">
                <Link to="/new-session" className="btn--link">
                  New Session
                </Link>
              </Button>
            </section>
            <section className="dashboard-card card--blue">
              <h2>Quick Links</h2>
              <div className="dashboard__quicklinks">
                <Link to="/new-session" className="link dashboard__quicklink">
                  <p>Ask a Question</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-note" className="link dashboard__quicklink">
                  <p>Create a Note</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-quiz" className="link dashboard__quicklink">
                  <p>Take a Quiz</p>
                  <NavigateNext />
                </Link>
                <Link to="/new-deck" className="link dashboard__quicklink">
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
